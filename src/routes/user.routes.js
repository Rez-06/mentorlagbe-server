import { Router } from "express";
import { usersCol } from "../config/collections.js";
import { verifyToken } from "../middleware/auth.js";
import { publicUser } from "../utils/helpers.js";

const router = Router();

router.get("/me", verifyToken, (req, res) => {
  res.json(req.user);
});

router.patch("/me", verifyToken, async (req, res, next) => {
  try {
    const { name, phone, bio, image } = req.body || {};
    const update = {};

    if (name !== undefined) {
      const v = String(name).trim();
      if (v.length < 2 || v.length > 60) return res.status(400).json({ message: "Name must be 2 to 60 characters" });
      update.name = v;
    }
    if (phone !== undefined) {
      const v = String(phone).trim();
      if (v.length > 20) return res.status(400).json({ message: "Phone number is too long" });
      update.phone = v;
    }
    if (bio !== undefined) {
      const v = String(bio).trim();
      if (v.length > 500) return res.status(400).json({ message: "Bio must be 500 characters or fewer" });
      update.bio = v;
    }
    if (image !== undefined) {
      const v = String(image).trim();
      if (v && !/^https?:\/\//i.test(v)) return res.status(400).json({ message: "Image must be a valid URL" });
      update.image = v;
    }
    if (!Object.keys(update).length) return res.status(400).json({ message: "Nothing to update" });

    update.updatedAt = new Date();
    const updated = await usersCol().findOneAndUpdate(
      { _id: req.user._id },
      { $set: update },
      { returnDocument: "after" }
    );
    res.json(publicUser(updated));
  } catch (err) {
    next(err);
  }
});

export default router;