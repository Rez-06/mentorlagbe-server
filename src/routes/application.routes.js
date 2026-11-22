import { Router } from "express";
import { applicationsCol, tuitionsCol } from "../config/collections.js";
import { verifyToken, verifyStudent, verifyTutor } from "../middleware/auth.js";
import { toObjectId, str } from "../utils/helpers.js";

const router = Router();

// POST /api/applications  (student applies)
router.post("/", verifyToken, verifyStudent, async (req, res, next) => {
  try {
    const tuitionId = toObjectId(str(req.body?.tuitionId));
    if (!tuitionId) return res.status(400).json({ message: "Invalid tuition id" });

    const studentPhone = str(req.body.studentPhone);
    const preferredSchedule = str(req.body.preferredSchedule);
    const studentNote = str(req.body.studentNote);
    if (!/^[0-9+\-\s]{7,20}$/.test(studentPhone)) return res.status(400).json({ message: "Enter a valid phone number" });
    if (preferredSchedule.length < 3 || preferredSchedule.length > 100) return res.status(400).json({ message: "Preferred schedule must be 3 to 100 characters" });
    if (studentNote.length > 500) return res.status(400).json({ message: "Note must be 500 characters or fewer" });

    const tuition = await tuitionsCol().findOne({ _id: tuitionId, approvalStatus: "approved", isActive: true });
    if (!tuition) return res.status(404).json({ message: "This tuition is not available for applications" });

    const duplicate = await applicationsCol().findOne({ tuitionId, studentEmail: req.user.email });
    if (duplicate) return res.status(409).json({ message: "You have already applied for this tuition" });

    const doc = {
      tuitionId,
      tuitionTitle: tuition.title,
      subject: tuition.subject,
      monthlyFee: tuition.monthlyFee,
      tutorEmail: tuition.tutorEmail,
      tutorName: tuition.tutorName,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentPhone,
      preferredSchedule,
      studentNote,
      status: "pending",
      appliedAt: new Date(),
    };
    const result = await applicationsCol().insertOne(doc);
    res.status(201).json({ ...doc, _id: result.insertedId });
  } catch (err) {
    next(err);
  }
});

// GET /api/applications/my  (student's own applications)
router.get("/my", verifyToken, verifyStudent, async (req, res, next) => {
  try {
    const apps = await applicationsCol().find({ studentEmail: req.user.email }).sort({ appliedAt: -1 }).toArray();
    const tuitions = await tuitionsCol()
      .find({ _id: { $in: apps.map((a) => a.tuitionId) } }, { projection: { tutorName: 1 } })
      .toArray();
    const names = new Map(tuitions.map((t) => [String(t._id), t.tutorName]));

    res.json({
      applications: apps.map((a) => ({ ...a, tutorName: a.tutorName || names.get(String(a.tuitionId)) || a.tutorEmail })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/applications/check/:tuitionId  (has this student already applied?)
router.get("/check/:tuitionId", verifyToken, async (req, res, next) => {
  try {
    const tuitionId = toObjectId(req.params.tuitionId);
    if (req.user.role !== "student" || !tuitionId) return res.json({ applied: false });
    const app = await applicationsCol().findOne({ tuitionId, studentEmail: req.user.email });
    res.json({ applied: !!app, status: app?.status || null });
  } catch (err) {
    next(err);
  }
});

// GET /api/applications/tutor  (applicants for the tutor's tuitions)
router.get("/tutor", verifyToken, verifyTutor, async (req, res, next) => {
  try {
    const applications = await applicationsCol().find({ tutorEmail: req.user.email }).sort({ appliedAt: -1 }).toArray();
    res.json({ applications });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/applications/:id/status  (tutor accepts or rejects)
router.patch("/:id/status", verifyToken, verifyTutor, async (req, res, next) => {
  try {
    const _id = toObjectId(req.params.id);
    const status = str(req.body?.status);
    if (!_id) return res.status(400).json({ message: "Invalid application id" });
    if (!["accepted", "rejected"].includes(status)) return res.status(400).json({ message: "Status must be accepted or rejected" });

    const updated = await applicationsCol().findOneAndUpdate(
      { _id, tutorEmail: req.user.email },
      { $set: { status, reviewedAt: new Date() } },
      { returnDocument: "after" }
    );
    if (!updated) return res.status(404).json({ message: "Application not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/applications/:id  (student cancels, only while pending)
router.delete("/:id", verifyToken, verifyStudent, async (req, res, next) => {
  try {
    const _id = toObjectId(req.params.id);
    if (!_id) return res.status(400).json({ message: "Invalid application id" });

    const app = await applicationsCol().findOne({ _id, studentEmail: req.user.email });
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (app.status !== "pending") return res.status(400).json({ message: "Only pending applications can be cancelled" });

    await applicationsCol().deleteOne({ _id });
    res.json({ message: "Application cancelled" });
  } catch (err) {
    next(err);
  }
});

export default router;