import { Collection, Db, ObjectId } from "mongodb";
import { JwtPayload, verify } from "jsonwebtoken";
import { JWT_SIGN } from "../middleware/config/jwtConfig.js";
import StandardError from "../constants/standardError";

interface Database {
  collection: (name: string) => Collection;
}

class BookDao {
  private db: Database;

  constructor(db: Db) {
    this.db = db as Database;
  }

  async findAllBooks(accessToken: string) {
    if (!JWT_SIGN) throw new Error("JWT_SIGN is not defined");

    const accessTokenPayload = verify(accessToken, JWT_SIGN) as JwtPayload;

    let query: Record<string, any> = { author: accessTokenPayload.username };

    if (
      accessTokenPayload.role === "admin" ||
      accessTokenPayload.role === "manager"
    ) {
      query = {};
    }

    const books = await this.db.collection("books").find(query).toArray();
    if (!books) {
      throw new StandardError({
        status: 404,
        message: "Book list not found",
        success: false,
      });
    }
    return books;
  }

  async createBook(accessToken: string, name: string) {
    if (!JWT_SIGN) throw new Error("JWT_SIGN is not defined");

    const accessTokenPayload = verify(accessToken, JWT_SIGN) as JwtPayload;

    const user = await this.db.collection("users").findOne({
      username: accessTokenPayload.username,
    });

    if (!user) {
      throw new StandardError({
        status: 404,
        message: "User not found",
        success: false,
      });
    }

    const books = await this.db
      .collection("books")
      .insertOne({ name, author: accessTokenPayload.username });
    return books;
  }

  async updateBook(accessToken: string, id: string, name: string) {
    if (!JWT_SIGN) throw new Error("JWT_SIGN is not defined");

    const accessTokenPayload = verify(accessToken, JWT_SIGN) as JwtPayload;
    const objectId = new ObjectId(id);

    const books = await this.db
      .collection("books")
      .findOneAndUpdate({ _id: objectId }, { $set: { name } });

    if (!books) {
      throw new StandardError({
        status: 404,
        message: "Book not found",
        success: false,
      });
    }

    if (accessTokenPayload.username !== books.author) {
      throw new StandardError({
        status: 403,
        message: "You are not allowed to update this book",
        success: false,
      });
    }

    return books;
  }

  async deleteBook(id: string, accessToken: string) {
    if (!JWT_SIGN) throw new Error("JWT_SIGN is not defined");

    const accessTokenPayload = verify(accessToken, JWT_SIGN) as JwtPayload;

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

    if (accessTokenPayload.username !== books.author) {
      throw new StandardError({
        status: 403,
        message: "You are not allowed to delete this book",
        success: false,
      });
    }

    return books;
  }
}

export default BookDao;
