import { Collection, Db, ObjectId } from "mongodb";
import StandardError from "../constants/standardError";

interface Database {
  collection: (name: string) => Collection;
}

class UserDao {
  private db: Database;

  constructor(db: Db) {
    this.db = db;
  }

  async findAllUsers() {
    const users = await this.db.collection("users").find().toArray();
    if (!users) {
      throw new StandardError({
        status: 404,
        message: "User list not found",
        success: false,
      });
    }
    return users;
  }

  async updateRole(id: string, role: string) {
    const user = await this.db
      .collection("users")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { role } });

    if (!user) {
      throw new StandardError({
        status: 404,
        message: "User not found",
        success: false,
      });
    }
    return user;
  }
}

export default UserDao;
