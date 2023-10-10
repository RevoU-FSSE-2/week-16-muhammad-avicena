import { AuthDaoInterface } from "types";
import { JwtPayload, sign } from "jsonwebtoken";
import { addDays } from "date-fns";
import NodeCache from "node-cache";
import { JWT_SIGN } from "../middleware/config/jwtConfig.js";
import bcrypt from "bcrypt";
import StandardError from "../constants/standardError";

const failedLoginAttemptsCache = new NodeCache({ stdTTL: 30 }) as any;

class AuthService {
  private authDao: AuthDaoInterface;

  constructor(authDao: AuthDaoInterface) {
    this.authDao = authDao;
  }

  async loginUser(username: string, password: string) {
    const loginAttempts = failedLoginAttemptsCache.get(username) || 0;
    console.log(loginAttempts);

    if (loginAttempts >= 4) {
      throw new StandardError({
        success: false,
        message: "Too many failed login attempts. Please try again later.",
        status: 429,
      });
    }

    try {
      const user = await this.authDao.loginUser({ username, password });
      if (!user) {
        failedLoginAttemptsCache.set(username, loginAttempts + 1);
        throw new StandardError({
          success: false,
          message: "Incorrect username or password. Please try again.",
          status: 401,
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        if (!JWT_SIGN) throw new Error("JWT_SIGN is not defined");

        const accessTokenExpiration = addDays(new Date(), 1);
        const accessToken = sign(
          { username: user.username, id: user._id, role: user.role },
          JWT_SIGN,
          { expiresIn: "24h" }
        );
        const refreshTokenPayload: JwtPayload = {
          username: user.username,
          id: user._id,
          role: user.role,
        };
        const refreshToken = sign(refreshTokenPayload, JWT_SIGN, {
          expiresIn: "7d",
        });

        await failedLoginAttemptsCache.del(username);

        return {
          success: true,
          message: {
            accessToken,
            refreshToken,
            accessTokenExpiration,
          },
        };
      } else {
        failedLoginAttemptsCache.set(username, loginAttempts + 1);
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
