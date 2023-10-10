import { Collection, Db } from "mongodb";
import StandardError from "../constants/standardError";
import { format } from "date-fns";

interface Database {
  collection: (name: string) => Collection;
}

interface UserData {
  username: string;
  password: string;
  role: string;
  createdDate: string;
}

class AuthDao {
  private db: Database;

  constructor(db: Db) {
    this.db = db;
  }

  async loginUser(userInfo: { username: string }) {
    const { username } = userInfo;
    const user = await this.db.collection("users").findOne({ username });
    if (!user) {
      throw new StandardError({
        status: 404,
        message: "User not found.",
        success: false,
      });
    }
    return user;
  }

  async registerUser(userInfo: { username: string; password: string }) {
    const { username, password } = userInfo;
    const newDate = new Date();
    const createdDate = format(newDate, "yyyy-MM-dd");
    const role = "member";

    const userData: UserData = {
      username,
      password,
      role,
      createdDate,
    };

    const isUserTaken = await this.db.collection("users").findOne({ username });
    if (isUserTaken) {
      throw new StandardError({
        success: false,
        message: "Username is not available. Please try another",
        status: 409,
      });
    }
    const result = await this.db.collection("users").insertOne(userData);
    return result;
  }
}

export default AuthDao;
