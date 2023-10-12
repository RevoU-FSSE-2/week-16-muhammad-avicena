import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controller/authController";

const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshAccessToken);

export default router;
