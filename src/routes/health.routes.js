import { Router } from "express";
import { getDB } from "../config/db.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    await getDB().command({ ping: 1 });
    res.json({ status: "ok", database: "connected", time: new Date() });
  } catch (err) {
    next(err);
  }
});

export default router;