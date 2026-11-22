import Stripe from "stripe";

let stripe;
export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw Object.assign(new Error("Stripe is not configured on the server"), { status: 500 });
  }
  return (stripe ||= new Stripe(process.env.STRIPE_SECRET_KEY));
};

// amount is in cents
export const PRO_PLANS = {
  student: { name: "Pro Student Plan", amount: 1000, description: "Priority booking, unlimited saved tuitions and a Pro badge" },
  tutor: { name: "Pro Tutor Plan", amount: 1500, description: "Unlimited tuition posts, verified badge and priority support" },
};