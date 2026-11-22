import { Router } from "express";
import { usersCol, tuitionsCol, paymentsCol } from "../config/collections.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import { publicUser, escapeRegex, toObjectId, str } from "../utils/helpers.js";

const router = Router();
router.use(verifyToken, verifyAdmin);

const pageOf = (req, def = 10) => ({
  page: Math.max(parseInt(req.query.page) || 1, 1),
  limit: Math.min(Math.max(parseInt(req.query.limit) || def, 1), 50),
});

// GET /api/admin/stats
router.get("/stats", async (req, res, next) => {
  try {
    const users = usersCol();
    const tuitions = tuitionsCol();
    const [totalUsers, totalTutors, totalStudents, totalAdmins, pending, approved, rejected, revenue] = await Promise.all([
      users.countDocuments(),
      users.countDocuments({ role: "tutor" }),
      users.countDocuments({ role: "student" }),
      users.countDocuments({ role: "admin" }),
      tuitions.countDocuments({ approvalStatus: "pending" }),
      tuitions.countDocuments({ approvalStatus: "approved" }),
      tuitions.countDocuments({ approvalStatus: "rejected" }),
      paymentsCol()
        .aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }])
        .toArray(),
    ]);

    res.json({
      totalUsers, totalTutors, totalStudents, totalAdmins,
      tuitions: { pending, approved, rejected },
      revenue: revenue[0]?.total || 0,
      payments: revenue[0]?.count || 0,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users?search=&role=&page=&limit=
router.get("/users", async (req, res, next) => {
  try {
    const { page, limit } = pageOf(req);
    const search = str(req.query.search);
    const role = str(req.query.role);

    const filter = {};
    if (["student", "tutor", "admin"].includes(role)) filter.role = role;
    if (search) {
      const rx = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ name: rx }, { email: rx }];
    }

    const [users, total] = await Promise.all([
      usersCol().find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
      usersCol().countDocuments(filter),
    ]);
    res.json({ users: users.map(publicUser), total, page, pages: Math.max(Math.ceil(total / limit), 1) });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/users/:id/role
router.patch("/users/:id/role", async (req, res, next) => {
  try {
    const _id = toObjectId(req.params.id);
    const role = str(req.body?.role);
    if (!_id) return res.status(400).json({ message: "Invalid user id" });
    if (!["student", "tutor", "admin"].includes(role)) return res.status(400).json({ message: "Invalid role" });
    if (String(_id) === String(req.user._id)) return res.status(400).json({ message: "You cannot change your own role" });

    const updated = await usersCol().findOneAndUpdate({ _id }, { $set: { role, updatedAt: new Date() } }, { returnDocument: "after" });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(publicUser(updated));
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/tuitions?status=&search=&page=&limit=
router.get("/tuitions", async (req, res, next) => {
  try {
    const { page, limit } = pageOf(req);
    const status = str(req.query.status);
    const search = str(req.query.search);

    const filter = {};
    if (["pending", "approved", "rejected"].includes(status)) filter.approvalStatus = status;
    if (search) {
      const rx = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ title: rx }, { subject: rx }, { tutorName: rx }];
    }

    const col = tuitionsCol();
    const [tuitions, total, grouped] = await Promise.all([
      col.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
      col.countDocuments(filter),
      col.aggregate([{ $group: { _id: "$approvalStatus", count: { $sum: 1 } } }]).toArray(),
    ]);

    const counts = { all: 0, pending: 0, approved: 0, rejected: 0 };
    grouped.forEach((g) => {
      counts[g._id] = g.count;
      counts.all += g.count;
    });

    res.json({ tuitions, total, page, pages: Math.max(Math.ceil(total / limit), 1), counts });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/tuitions/:id/status  { approvalStatus }
router.patch("/tuitions/:id/status", async (req, res, next) => {
  try {
    const _id = toObjectId(req.params.id);
    const approvalStatus = str(req.body?.approvalStatus);
    if (!_id) return res.status(400).json({ message: "Invalid tuition id" });
    if (!["approved", "rejected", "pending"].includes(approvalStatus)) return res.status(400).json({ message: "Invalid status" });

    const updated = await tuitionsCol().findOneAndUpdate(
      { _id },
      { $set: { approvalStatus, reviewedAt: new Date() } },
      { returnDocument: "after" }
    );
    if (!updated) return res.status(404).json({ message: "Tuition not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;