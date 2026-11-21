import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.get("/me", verifyToken, (req, res) => {
  res.json(req.user);
});

export default router;