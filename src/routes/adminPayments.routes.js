import { Router } from "express";
import { paymentsCol } from "../config/collections.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import { escapeRegex, str } from "../utils/helpers.js";

const router = Router();
router.use(verifyToken, verifyAdmin);

// GET /api/admin/payments?search=&role=&page=&limit=
router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const search = str(req.query.search);
    const role = str(req.query.role);

    const filter = {};
    if (["student", "tutor"].includes(role)) filter.userRole = role;
    if (search) {
      const rx = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ userName: rx }, { userEmail: rx }, { transactionId: rx }];
    }

    const col = paymentsCol();
    const [payments, total, grouped] = await Promise.all([
      col.find(filter).sort({ paidAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
      col.countDocuments(filter),
      col.aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: "$userRole", amount: { $sum: "$amount" }, count: { $sum: 1 } } }]).toArray(),
    ]);

    const summary = { revenue: 0, count: 0, tutor: { amount: 0, count: 0 }, student: { amount: 0, count: 0 } };
    grouped.forEach((g) => {
      summary.revenue += g.amount;
      summary.count += g.count;
      if (summary[g._id]) summary[g._id] = { amount: g.amount, count: g.count };
    });

    res.json({ payments, total, page, pages: Math.max(Math.ceil(total / limit), 1), summary });
  } catch (err) {
    next(err);
  }
});

export default router;