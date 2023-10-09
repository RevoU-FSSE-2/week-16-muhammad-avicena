import StandardError from "../constants/standardError";
import { BookDaoInterface } from "../types";

class BookService {
  private bookDao: BookDaoInterface;

  constructor(bookDao: BookDaoInterface) {
    this.bookDao = bookDao;
  }

  async getAllBooks() {
    try {
      const books = await this.bookDao.findAllBooks();
      return { success: true, message: books };
    } catch (error: any) {
      console.log(error);
      throw new StandardError({
        status: error.status,
        message: error.message,
        success: false,
      });
    }
  }

  async createBook(name: string, author: string) {
    try {
      const books = await this.bookDao.createBook(name, author);
      return { success: true, message: books.insertedId };
    } catch (error: any) {
      console.log(error);
      throw new StandardError({
        status: error.status,
        message: error.message,
        success: false,
      });
    }
  }

  async updateBook(id: string, name: string, author: string) {
    console.log(id, name, author);
    try {
      const books = await this.bookDao.updateBook(id, name, author);
      return { success: true, message: books };
    } catch (error: any) {
      console.log(error);
      throw new StandardError({
        status: error.status,
        message: error.message,
        success: false,
      });
    }
  }

  async deleteBook(id: string) {
    try {
      const books = await this.bookDao.deleteBook(id);
      return { success: true, message: books.deletedCount };
    } catch (error: any) {
      console.log(error);
      throw new StandardError({
        status: error.status,
        message: error.message,
        success: false,
      });
    }
  }
}

export default BookService;
