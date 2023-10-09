import { Collection, Db, ObjectId } from "mongodb";
import StandardError from "../constants/standardError";

interface Database {
  collection: (name: string) => Collection;
}

class BookDao {
  private db: Database;

  constructor(db: Db) {
    this.db = db as Database;
  }

  async findAllBooks() {
    const books = await this.db.collection("books").find({}).toArray();
    if (!books) {
      throw new StandardError({
        status: 404,
        message: "Book list not found",
        success: false,
      });
    }
    return books;
  }

  async createBook(name: string, author: string) {
    const books = await this.db.collection("books").insertOne({ name, author });
    return books;
  }

  async updateBook(id: string, name: string, author: string) {
    const objectId = new ObjectId(id);
    const books = await this.db
      .collection("books")
      .findOneAndUpdate({ _id: objectId }, { $set: { name, author } });
    if (!books) {
      throw new StandardError({
        status: 404,
        message: "Book not found",
        success: false,
      });
    }
    return books;
  }

  async deleteBook(id: string) {
    const objectId = new ObjectId(id);
    const books = await this.db
      .collection("books")
      .findOneAndDelete({ _id: objectId });
    if (!books) {
      throw new StandardError({
        status: 404,
        message: "Book not found",
        success: false,
      });
    }
    return books;
  }
}

export default BookDao;
