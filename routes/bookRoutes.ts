import { Router } from "express";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../controller/bookController";
import {
  userAuthentication,
  adminAuthorization,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/", userAuthentication, getAllBooks);
router.post("/", adminAuthorization, createBook);
router.put("/:id", adminAuthorization, updateBook);
router.delete("/:id", adminAuthorization, deleteBook);

export default router;
