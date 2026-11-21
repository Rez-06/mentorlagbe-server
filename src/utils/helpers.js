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