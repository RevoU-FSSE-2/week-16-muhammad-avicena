import { Router } from "express";
import {
  getDataXss,
  getClickJacking,
  createClickJacking,
} from "../controller/preventAttackController";

const router = Router();

router.get("/xss", getDataXss);
router.get("/click-jacking", getClickJacking);
router.post("/click-jacking", createClickJacking);

export default router;
