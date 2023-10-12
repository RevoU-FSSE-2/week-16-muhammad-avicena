import { Router } from "express";
import { findAllUsers, updateRole } from "../controller/userController";
import {
  adminAuthorization,
  managerAuthorization,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/", adminAuthorization, findAllUsers);
router.patch("/:id", managerAuthorization, updateRole);

export default router;
