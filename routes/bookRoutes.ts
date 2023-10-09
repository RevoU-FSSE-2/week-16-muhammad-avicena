import { Router } from "express";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../controller/bookController";

const router = Router();

router.get("/", getAllBooks);
router.post("/", createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
