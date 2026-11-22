import { Router } from "express";
import { usersCol, tuitionsCol } from "../config/collections.js";
import { verifyToken, verifyStudent } from "../middleware/auth.js";
import { toObjectId } from "../utils/helpers.js";
import { FREE_BOOKMARK_LIMIT } from "../utils/constants.js";

const router = Router();
router.use(verifyToken, verifyStudent);

const savedOf = async (userId) => {
  const u = await usersCol().findOne({ _id: userId }, { projection: { savedTuitions: 1 } });
  return u?.savedTuitions || [];
};
const limitOf = (user) => (user.plan === "pro" ? null : FREE_BOOKMARK_LIMIT);

// GET /api/bookmarks/ids
router.get("/ids", async (req, res, next) => {
  try {
    const saved = await savedOf(req.user._id);
    res.json({ ids: saved.map(String), limit: limitOf(req.user) });
  } catch (err) {
    next(err);
  }
});

// GET /api/bookmarks  (full tuition documents, most recently saved first)
router.get("/", async (req, res, next) => {
  try {
    const saved = await savedOf(req.user._id);
    const tuitions = await tuitionsCol().find({ _id: { $in: saved }, approvalStatus: "approved", isActive: true }).toArray();
    const order = [...saved].reverse().map(String);
    tuitions.sort((a, b) => order.indexOf(String(a._id)) - order.indexOf(String(b._id)));
    res.json({ tuitions, limit: limitOf(req.user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/bookmarks/:tuitionId
router.post("/:tuitionId", async (req, res, next) => {
  try {
    const tuitionId = toObjectId(req.params.tuitionId);
    if (!tuitionId) return res.status(400).json({ message: "Invalid tuition id" });

    const tuition = await tuitionsCol().findOne({ _id: tuitionId, approvalStatus: "approved", isActive: true });
    if (!tuition) return res.status(404).json({ message: "Tuition not found" });

    const saved = await savedOf(req.user._id);
    const already = saved.some((id) => String(id) === String(tuitionId));
    if (!already && req.user.plan !== "pro" && saved.length >= FREE_BOOKMARK_LIMIT) {
      return res.status(403).json({
        code: "FREE_LIMIT",
        message: `Free students can save ${FREE_BOOKMARK_LIMIT} tuitions. Upgrade to Pro for unlimited saves.`,
      });
    }

    await usersCol().updateOne({ _id: req.user._id }, { $addToSet: { savedTuitions: tuitionId } });
    res.status(201).json({ ids: await savedOf(req.user._id).then((s) => s.map(String)) });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/bookmarks/:tuitionId
router.delete("/:tuitionId", async (req, res, next) => {
  try {
    const tuitionId = toObjectId(req.params.tuitionId);
    if (!tuitionId) return res.status(400).json({ message: "Invalid tuition id" });
    await usersCol().updateOne({ _id: req.user._id }, { $pull: { savedTuitions: tuitionId } });
    res.json({ ids: await savedOf(req.user._id).then((s) => s.map(String)) });
  } catch (err) {
    next(err);
  }
});

export default router;