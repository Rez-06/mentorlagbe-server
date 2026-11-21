import { ObjectId } from "mongodb";

export const publicUser = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  image: u.image || "",
  role: u.role || "student",
  phone: u.phone || "",
  bio: u.bio || "",
  plan: u.plan || "free",
  createdAt: u.createdAt,
});

export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const toObjectId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

export const str = (v) => (typeof v === "string" ? v.trim() : "");