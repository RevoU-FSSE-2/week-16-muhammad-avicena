import { Router } from "express";
import bookRoutes from "./bookRoutes";
import homeRoutes from "./homeRoutes";
import preventAttackRoutes from "./preventAttackRoutes";

const router = Router();

router.use("/", homeRoutes);
router.use("/api/v1/attack", preventAttackRoutes);
router.use("/api/v1/books", bookRoutes);

export default router;
