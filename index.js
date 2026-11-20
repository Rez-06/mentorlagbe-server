import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import healthRoutes from "./src/routes/health.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: (process.env.CLIENT_URL || "").split(",").map((u) => u.trim()),
    credentials: true,
  })
);
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/", (req, res) => {
  res.json({ message: "MentorLagbe API is running " });
});

app.use("/api/health", healthRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
}

export default app;