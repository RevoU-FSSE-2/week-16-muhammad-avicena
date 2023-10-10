import { AuthDaoInterface } from "types";
import { JwtPayload, sign } from "jsonwebtoken";
import { addDays } from "date-fns";
import { JWT_SIGN } from "../middleware/config/jwtConfig.js";
import bcrypt from "bcrypt";
import StandardError from "../constants/standardError";

class AuthService {
  private authDao: AuthDaoInterface;

  constructor(authDao: AuthDaoInterface) {
    this.authDao = authDao;
  }

  async loginUser(username: string, password: string) {
    try {
      const user = await this.authDao.loginUser({ username, password });
      if (!user) {
        throw new StandardError({
          success: false,
          message: "Incorrect username or password. Please try again.",
          status: 401,
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        if (!JWT_SIGN) throw new Error("JWT_SIGN is not defined");

        const accessToken = sign(
          { username: user.username, id: user._id, role: user.role },
          JWT_SIGN,
          { expiresIn: "3h" }
        );

        const refreshTokenPayload: JwtPayload = {
          username: user.username,
          id: user._id,
          role: user.role,
        };
        const refreshToken = sign(refreshTokenPayload, JWT_SIGN, {
          expiresIn: "7d",
        });

        const accessTokenExpiration = addDays(new Date(), 7);

        return {
          success: true,
          message: {
            accessToken,
            refreshToken,
            accessTokenExpiration,
          },
        };
      } else {
        throw new StandardError({
          success: false,
          message: "Incorrect username or password. Please try again.",
          status: 401,
        });
      }
    } catch (error: any) {
      console.log(error);
      throw new StandardError({
        success: false,
        status: error.status,
        message: error.message,
      });
    }
  }

  async registerUser(username: string, password: string) {
    try {
      if (!username || !password) {
        throw new StandardError({
          success: false,
          message: "Invalid input data. Please try again.",
          status: 400,
        });
      }

      if (username.trim() === "") {
        throw new StandardError({
          success: false,
          message: "Username cannot be blank. Please try again.",
          status: 400,
        });
      }

      if (password.length >= 8 && /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.authDao.registerUser({
          username,
          password: hashedPassword,
        });
        return { success: true, message: user.insertedId };
      } else {
        throw new StandardError({
          success: false,
          message:
            "Password should be at least 8 characters and contain alphanumeric characters",
          status: 400,
        });
      }
    } catch (error: any) {
      console.log(error);
      throw new StandardError({
        success: false,
        status: error.status,
        message: error.message,
      });
    }
  }
}

export default AuthService;
