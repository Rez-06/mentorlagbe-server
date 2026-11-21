import { Router } from "express";
import { tuitionsCol, usersCol } from "../config/collections.js";
import { escapeRegex, toObjectId, str } from "../utils/helpers.js";

const router = Router();
const PUBLIC = { approvalStatus: "approved", isActive: true };

const sorts = {
  newest: { createdAt: -1 },
  "fee-low": { monthlyFee: 1 },
  "fee-high": { monthlyFee: -1 },
};

// GET /api/tuitions?search=&subject=&classLevel=&mode=&sort=&page=&limit=
router.get("/", async (req, res, next) => {
  try {
    const search = str(req.query.search);
    const subject = str(req.query.subject);
    const classLevel = str(req.query.classLevel);
    const mode = str(req.query.mode);
    const sort = sorts[str(req.query.sort)] || sorts.newest;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 9, 1), 24);

    const filter = { ...PUBLIC };
    if (search) {
      const rx = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ title: rx }, { subject: rx }];
    }
    if (subject) filter.subject = subject;
    if (classLevel) filter.classLevel = classLevel;
    if (mode) filter.mode = mode;

    const col = tuitionsCol();
    const [tuitions, total] = await Promise.all([
      col.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).toArray(),
      col.countDocuments(filter),
    ]);

    res.json({ tuitions, total, page, limit, pages: Math.max(Math.ceil(total / limit), 1) });
  } catch (err) {
    next(err);
  }
});

// GET /api/tuitions/latest?limit=6  (home page)
router.get("/latest", async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 6, 1), 12);
    const tuitions = await tuitionsCol().find(PUBLIC).sort({ createdAt: -1 }).limit(limit).toArray();
    res.json({ tuitions });
  } catch (err) {
    next(err);
  }
});

// GET /api/tuitions/:id
router.get("/:id", async (req, res, next) => {
  try {
    const _id = toObjectId(req.params.id);
    if (!_id) return res.status(400).json({ message: "Invalid tuition id" });

    const tuition = await tuitionsCol().findOne({ _id, ...PUBLIC });
    if (!tuition) return res.status(404).json({ message: "Tuition not found" });

    const tutor = await usersCol().findOne({ email: tuition.tutorEmail });
    res.json({
      ...tuition,
      tutor: tutor
        ? { name: tutor.name, image: tutor.image || "", bio: tutor.bio || "", plan: tutor.plan || "free" }
        : { name: tuition.tutorName, image: "", bio: "", plan: "free" },
    });
  } catch (err) {
    next(err);
  }
});

export default router;