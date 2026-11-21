import { Router } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";
import { usersCol } from "../config/collections.js";
import { signToken } from "../utils/jwt.js";
import { publicUser } from "../utils/helpers.js";

const router = Router();

// Exchange a valid BetterAuth session for our API JWT
router.post("/", async (req, res, next) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) return res.status(401).json({ message: "No active session" });

    const user = await usersCol().findOne({ email: session.user.email });
    if (!user) return res.status(401).json({ message: "User not found" });

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

export default router;