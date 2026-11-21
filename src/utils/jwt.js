import jwt from "jsonwebtoken";

export const signToken = (user) =>
  jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const verifyJwt = (token) => jwt.verify(token, process.env.JWT_SECRET);