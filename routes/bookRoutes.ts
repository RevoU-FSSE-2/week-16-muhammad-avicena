import { Router } from "express";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../controller/bookController";
import {
  userAuthentication,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/", userAuthentication, getAllBooks);
router.post("/", userAuthentication, createBook);
router.put("/:id", userAuthentication, updateBook);
router.delete("/:id", userAuthentication, deleteBook);

export default router;
