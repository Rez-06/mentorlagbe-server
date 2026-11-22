import { Router } from "express";
import { tuitionsCol, applicationsCol } from "../config/collections.js";
import { verifyToken, verifyTutor } from "../middleware/auth.js";
import { toObjectId } from "../utils/helpers.js";
import { validateTuition } from "../utils/validators.js";
import { FREE_TUITION_LIMIT } from "../utils/constants.js";

const router = Router();
router.use(verifyToken, verifyTutor);

// Finds a tuition that belongs to the logged-in tutor (sends the error response itself if not)
async function findOwn(req, res) {
  const _id = toObjectId(req.params.id);
  if (!_id) {
    res.status(400).json({ message: "Invalid tuition id" });
    return null;
  }
  const tuition = await tuitionsCol().findOne({ _id, tutorEmail: req.user.email });
  if (!tuition) {
    res.status(404).json({ message: "Tuition not found" });
    return null;
  }
  return tuition;
}

// GET /api/tutor/tuitions  (all my tuitions + applicant counts + plan limit)
router.get("/tuitions", async (req, res, next) => {
  try {
    const tuitions = await tuitionsCol().find({ tutorEmail: req.user.email }).sort({ createdAt: -1 }).toArray();
    const counts = await applicationsCol()
      .aggregate([{ $match: { tutorEmail: req.user.email } }, { $group: { _id: "$tuitionId", count: { $sum: 1 } } }])
      .toArray();
    const map = new Map(counts.map((c) => [String(c._id), c.count]));

    res.json({
      tuitions: tuitions.map((t) => ({ ...t, applicants: map.get(String(t._id)) || 0 })),
      limit: req.user.plan === "pro" ? null : FREE_TUITION_LIMIT,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/tutor/tuitions
router.post("/tuitions", async (req, res, next) => {
  try {
    const { error, data } = validateTuition(req.body);
    if (error) return res.status(400).json({ message: error });

    if (req.user.plan !== "pro") {
      const posted = await tuitionsCol().countDocuments({ tutorEmail: req.user.email });
      if (posted >= FREE_TUITION_LIMIT) {
        return res.status(403).json({
          code: "FREE_LIMIT",
          message: `Free plan allows ${FREE_TUITION_LIMIT} tuition posts. Upgrade to Pro for unlimited posts.`,
        });
      }
    }

    const doc = {
      ...data,
      tutorName: req.user.name,
      tutorEmail: req.user.email,
      approvalStatus: "pending",
      isActive: true,
      createdAt: new Date(),
    };
    const result = await tuitionsCol().insertOne(doc);
    res.status(201).json({ ...doc, _id: result.insertedId });
  } catch (err) {
    next(err);
  }
});

// GET /api/tutor/tuitions/:id
router.get("/tuitions/:id", async (req, res, next) => {
  try {
    const tuition = await findOwn(req, res);
    if (tuition) res.json(tuition);
  } catch (err) {
    next(err);
  }
});

// PUT /api/tutor/tuitions/:id  (a rejected tuition goes back to pending when edited)
router.put("/tuitions/:id", async (req, res, next) => {
  try {
    const existing = await findOwn(req, res);
    if (!existing) return;

    const { error, data } = validateTuition(req.body);
    if (error) return res.status(400).json({ message: error });

    const set = { ...data, updatedAt: new Date() };
    if (existing.approvalStatus === "rejected") set.approvalStatus = "pending";

    const updated = await tuitionsCol().findOneAndUpdate({ _id: existing._id }, { $set: set }, { returnDocument: "after" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tutor/tuitions/:id/toggle  (Active <-> Closed)
router.patch("/tuitions/:id/toggle", async (req, res, next) => {
  try {
    const existing = await findOwn(req, res);
    if (!existing) return;
    const updated = await tuitionsCol().findOneAndUpdate(
      { _id: existing._id },
      { $set: { isActive: !existing.isActive } },
      { returnDocument: "after" }
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tutor/tuitions/:id  (also removes its applications)
router.delete("/tuitions/:id", async (req, res, next) => {
  try {
    const existing = await findOwn(req, res);
    if (!existing) return;
    await tuitionsCol().deleteOne({ _id: existing._id });
    await applicationsCol().deleteMany({ tuitionId: existing._id });
    res.json({ message: "Tuition deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;