import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { connectDB } from "./src/config/db.js";
import { auth } from "./src/config/auth.js";
import apiRoutes from "./src/routes/index.js";
import { stripeWebhook } from "./src/routes/payment.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: (process.env.CLIENT_URL || "").split(",").map((u) => u.trim()),
    credentials: true,
    exposedHeaders: ["set-auth-token"],
  })
);

// Make sure the DB is connected before every request (works locally and on Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// These two MUST come before express.json()
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), stripeWebhook);
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "MentorLagbe API is running 🚀" });
});

app.use("/api", apiRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ message: "Image must be 4MB or smaller" });
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
}

export default app;