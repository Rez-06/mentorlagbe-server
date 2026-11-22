import { Router } from "express";
import { getStripe, PRO_PLANS } from "../config/stripe.js";
import { usersCol, paymentsCol } from "../config/collections.js";
import { verifyToken } from "../middleware/auth.js";
import { str } from "../utils/helpers.js";

let indexReady = false;

// Saves the payment and upgrades the user. Safe to call twice (webhook + verify).
export async function fulfillSession(session) {
  const { userEmail, userName, userRole, planName } = session.metadata || {};
  if (!userEmail) throw new Error("Checkout session has no user data");

  if (!indexReady) {
    await paymentsCol().createIndex({ stripeSessionId: 1 }, { unique: true });
    indexReady = true;
  }

  const intent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

  await paymentsCol().updateOne(
    { stripeSessionId: session.id },
    {
      $setOnInsert: {
        userEmail, userName, userRole, planName,
        amount: (session.amount_total || 0) / 100,
        currency: session.currency || "usd",
        transactionId: intent || session.id,
        stripeSessionId: session.id,
        paymentStatus: "paid",
        paidAt: new Date(),
      },
    },
    { upsert: true }
  );
  await usersCol().updateOne({ email: userEmail }, { $set: { plan: "pro", updatedAt: new Date() } });
  return paymentsCol().findOne({ stripeSessionId: session.id });
}

// Mounted in index.js with a RAW body (Stripe needs the untouched bytes to check the signature)
export async function stripeWebhook(req, res) {
  let event;
  try {
    event = getStripe().webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed" && event.data.object.payment_status === "paid") {
    try {
      await fulfillSession(event.data.object);
    } catch (err) {
      console.error("Webhook fulfil failed:", err);
      return res.status(500).json({ received: false });
    }
  }
  res.json({ received: true });
}

const router = Router();

// POST /api/payments/checkout  -> { url }
router.post("/checkout", verifyToken, async (req, res, next) => {
  try {
    const plan = PRO_PLANS[req.user.role];
    if (!plan) return res.status(400).json({ message: "Only students and tutors can buy a Pro plan" });
    if (req.user.plan === "pro") return res.status(400).json({ message: "You are already on the Pro plan" });

    const clientUrl = (process.env.CLIENT_URL || "").split(",")[0].trim();
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: req.user.email,
      line_items: [
        { quantity: 1, price_data: { currency: "usd", unit_amount: plan.amount, product_data: { name: plan.name, description: plan.description } } },
      ],
      metadata: { userEmail: req.user.email, userName: req.user.name, userRole: req.user.role, planName: plan.name },
      success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/payment/cancel`,
    });
    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/verify { sessionId }  (called by the success page)
router.post("/verify", verifyToken, async (req, res, next) => {
  try {
    const sessionId = str(req.body?.sessionId);
    if (!sessionId.startsWith("cs_")) return res.status(400).json({ message: "Invalid payment session" });

    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.metadata?.userEmail !== req.user.email) return res.status(403).json({ message: "This payment belongs to another account" });
    if (session.payment_status !== "paid") return res.status(400).json({ message: "Payment has not been completed" });

    const payment = await fulfillSession(session);
    res.json({ payment });
  } catch (err) {
    next(err);
  }
});

export default router;