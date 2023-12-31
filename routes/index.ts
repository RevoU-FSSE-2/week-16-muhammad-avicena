import { Router } from "express";
import bookRoutes from "./bookRoutes";
import homeRoutes from "./homeRoutes";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import preventAttackRoutes from "./preventAttackRoutes";

const router = Router();

router.use("/", homeRoutes);
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/attack", preventAttackRoutes);
router.use("/api/v1/books", bookRoutes);
router.use("/api/v1/users", userRoutes);

export default router;
