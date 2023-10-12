import StandardError from "../constants/standardError";
import { UserDaoInterface } from "../types";

class UserService {
  private userDao: UserDaoInterface;

  constructor(userDao: UserDaoInterface) {
    this.userDao = userDao;
  }

  async findAllUsers() {
    try {
      const users = await this.userDao.findAllUsers();
      return { success: true, message: users };
    } catch (error: any) {
      console.log(error);
      throw new StandardError({
        status: error.status,
        message: error.message,
        success: false,
      });
    }
  }

  async updateRole(id: string, role: string) {
    try {
      const user = await this.userDao.updateRole(id, role);
      return { success: true, message: user };
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

export default UserService;
