import { usersCol } from "../config/collections.js";
import { verifyJwt } from "../utils/jwt.js";
import { publicUser } from "../utils/helpers.js";

export async function verifyToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized: token missing" });

  try {
    const decoded = verifyJwt(token);
    // Load the user fresh so role/plan changes apply immediately
    const user = await usersCol().findOne({ email: decoded.email });
    if (!user) return res.status(401).json({ message: "Unauthorized: user not found" });
    req.user = publicUser(user);
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized: invalid or expired token" });
  }
}

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Forbidden: ${roles.join(" / ")} access only` });
  }
  next();
};

export const verifyStudent = requireRole("student");
export const verifyTutor = requireRole("tutor");
export const verifyAdmin = requireRole("admin");