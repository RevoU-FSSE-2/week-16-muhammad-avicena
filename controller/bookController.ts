import BookDao from "../dao/bookDao";
import BookService from "../service/bookService";
import { NextFunction, Request, Response } from "express";

async function getAllBooks(req: Request, res: Response, next: NextFunction) {
  const { db } = req;
  const accessToken = req.cookies.access_token;
  try {
    const bookDao = new BookDao(db);
    const bookService = new BookService(bookDao);
    const result = await bookService.getAllBooks(accessToken);
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Successfully get all books",
        data: result.message,
      });
    }
  } catch (error) {
    next(error);
  }
}

async function createBook(req: Request, res: Response, next: NextFunction) {
  const { db } = req;
  const { name, author } = req.body;
  try {
    const bookDao = new BookDao(db);
    const bookService = new BookService(bookDao);
    const result = await bookService.createBook(name, author);
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Successfully create book",
        data: { _id: result.message },
      });
    }
  } catch (error) {
    next(error);
  }
}

async function updateBook(req: Request, res: Response, next: NextFunction) {
  const { db } = req;
  const accessToken = req.cookies.access_token;
  const { id } = req.params;
  const { name } = req.body;

  try {
    const bookDao = new BookDao(db);
    const bookService = new BookService(bookDao);
    const result = await bookService.updateBook(accessToken, id, name);
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Successfully update book",
        data: result.message,
      });
    }
  } catch (error) {
    next(error);
  }
}

async function deleteBook(req: Request, res: Response, next: NextFunction) {
  const { db } = req;
  const { id } = req.params;
  try {
    const bookDao = new BookDao(db);
    const bookService = new BookService(bookDao);
    const result = await bookService.deleteBook(id);
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Successfully delete book",
        data: result.message,
      });
    }
  } catch (error) {
    next(error);
  }
}

export { getAllBooks, createBook, updateBook, deleteBook };
