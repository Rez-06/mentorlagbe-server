import { Router } from "express";
import healthRoutes from "./health.routes.js";
import jwtRoutes from "./jwt.routes.js";
import userRoutes from "./user.routes.js";
import tuitionRoutes from "./tuition.routes.js";
import uploadRoutes from "./upload.routes.js";
import tutorRoutes from "./tutor.routes.js";
import applicationRoutes from "./application.routes.js";
import paymentRoutes from "./payment.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/jwt", jwtRoutes);
router.use("/users", userRoutes);
router.use("/tuitions", tuitionRoutes);
router.use("/upload", uploadRoutes);
router.use("/tutor", tutorRoutes);
router.use("/applications", applicationRoutes);
router.use("/payments", paymentRoutes);
router.use("/admin", adminRoutes);

export default router;