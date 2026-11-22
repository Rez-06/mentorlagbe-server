import { Router } from "express";
import { tuitionsCol, applicationsCol } from "../config/collections.js";
import { verifyToken, verifyStudent } from "../middleware/auth.js";
import { toObjectId, str } from "../utils/helpers.js";

const router = Router();

// GET /api/reviews/eligibility/:tuitionId
router.get("/eligibility/:tuitionId", verifyToken, verifyStudent, async (req, res, next) => {
  try {
    const tuitionId = toObjectId(req.params.tuitionId);
    if (!tuitionId) return res.json({ eligible: false, reviewed: false, accepted: false });

    const [accepted, tuition] = await Promise.all([
      applicationsCol().findOne({ tuitionId, studentEmail: req.user.email, status: "accepted" }),
      tuitionsCol().findOne({ _id: tuitionId }, { projection: { reviews: 1 } }),
    ]);
    const reviewed = !!tuition?.reviews?.some((r) => r.studentId === String(req.user._id));
    res.json({ eligible: !!accepted && !reviewed, reviewed, accepted: !!accepted });
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews  { tuitionId, rating, comment }
router.post("/", verifyToken, verifyStudent, async (req, res, next) => {
  try {
    const tuitionId = toObjectId(str(req.body?.tuitionId));
    const rating = Number(req.body?.rating);
    const comment = str(req.body?.comment);

    if (!tuitionId) return res.status(400).json({ message: "Invalid tuition id" });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be 1 to 5 stars" });
    if (comment.length < 5 || comment.length > 500) return res.status(400).json({ message: "Feedback must be 5 to 500 characters" });

    const accepted = await applicationsCol().findOne({ tuitionId, studentEmail: req.user.email, status: "accepted" });
    if (!accepted) return res.status(403).json({ message: "Only students with an accepted application can review this tuition" });

    const tuition = await tuitionsCol().findOne({ _id: tuitionId });
    if (!tuition) return res.status(404).json({ message: "Tuition not found" });
    if (tuition.reviews?.some((r) => r.studentId === String(req.user._id))) {
      return res.status(409).json({ message: "You have already reviewed this tuition" });
    }

    const review = {
      studentId: String(req.user._id),
      studentName: req.user.name,
      studentImage: req.user.image || "",
      rating,
      comment,
      createdAt: new Date(),
    };
    const all = [review, ...(tuition.reviews || [])];
    const avgRating = Math.round((all.reduce((sum, r) => sum + r.rating, 0) / all.length) * 10) / 10;

    await tuitionsCol().updateOne(
      { _id: tuitionId },
      { $push: { reviews: { $each: [review], $position: 0 } }, $set: { avgRating, reviewCount: all.length } }
    );
    res.status(201).json({ review, avgRating, reviewCount: all.length });
  } catch (err) {
    next(err);
  }
});

export default router;