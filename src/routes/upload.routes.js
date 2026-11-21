import { Router } from "express";
import multer from "multer";
import { verifyToken } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 4 * 1024 * 1024 } });

router.post("/", verifyToken, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file received" });
    if (!/^image\/(png|jpe?g|webp|gif)$/.test(req.file.mimetype)) {
      return res.status(400).json({ message: "Only PNG, JPG, WEBP or GIF images are allowed" });
    }

    const form = new FormData();
    form.append("image", req.file.buffer.toString("base64"));

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: "POST",
      body: form,
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      return res.status(502).json({ message: result?.error?.message || "Image upload failed" });
    }
    res.json({ url: result.data.display_url || result.data.url });
  } catch (err) {
    next(err);
  }
});

export default router;