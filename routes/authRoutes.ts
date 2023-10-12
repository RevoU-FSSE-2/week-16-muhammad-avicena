import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
  resetPasswordRequest,
} from "../controller/authController";

const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/reset-password/request", resetPasswordRequest);
router.post("/reset-password", resetPassword);

export default router;
