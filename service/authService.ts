import { AuthDaoInterface } from "types";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { addDays } from "date-fns";
import NodeCache from "node-cache";
import { JWT_SIGN } from "../middleware/config/jwtConfig.js";
import bcrypt from "bcrypt";
import StandardError from "../constants/standardError";

const failedLoginAttemptsCache = new NodeCache({ stdTTL: 600 }) as any;
const cacheKey = new NodeCache({ stdTTL: 300 }) as any;

class AuthService {
  private authDao: AuthDaoInterface;

  constructor(authDao: AuthDaoInterface) {
    this.authDao = authDao;
  }

  async loginUser(username: string, password: string) {
    try {
      const user = await this.authDao.loginUser({ username, password });
      const loginAttempts = failedLoginAttemptsCache.get(username) || 1;

      if (loginAttempts >= 5) {
        throw new StandardError({
          success: false,
          message: "Too many failed login attempts. Please try again later.",
          status: 429,
        });
      }

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

        const accessTokenExpiration = addDays(new Date(), 600);
        const accessToken = sign(
          { username: user.username, id: user._id, role: user.role },
          JWT_SIGN,
          { expiresIn: "10m" }
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

  async registerUser(username: string, password: string, email: string) {
    try {
      if (!username || !password || !email) {
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
          email,
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

  async refreshAccessToken(refreshToken: string) {
    if (!JWT_SIGN) throw new Error("JWT_SIGN is not defined");

    const decodedRefreshToken = verify(refreshToken, JWT_SIGN) as JwtPayload;

    if (
      !decodedRefreshToken ||
      !decodedRefreshToken.exp ||
      typeof decodedRefreshToken.exp !== "number"
    ) {
      throw new StandardError({
        success: false,
        status: 401,
        message: "Refresh token is invalid or has expired. Please login again",
      });
    }

    if (decodedRefreshToken.exp < Date.now() / 1000) {
      throw new StandardError({
        success: false,
        status: 401,
        message: "Refresh token has expired. Please login again",
      });
    }

    const accessToken = sign({ userId: decodedRefreshToken.userId }, JWT_SIGN, {
      expiresIn: "10m",
    });

    return { success: true, message: { accessToken } };
  }

  async resetPasswordRequest(email: string) {
    try {
      await this.authDao.resetPasswordRequest(email);

      const tokenResetPassword = uuidv4();

      cacheKey.set(tokenResetPassword, email, 3600);

      return {
        success: true,
        message: "Password reset link sent successfully",
        data: tokenResetPassword,
      };
    } catch (error: any) {
      console.log(error);
      throw new StandardError({
        success: false,
        status: error.status,
        message: error.message,
      });
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const email = cacheKey.get(token);

      if (!email) {
        throw new StandardError({
          success: false,
          status: 401,
          message: "Invalid or expired token",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await this.authDao.resetPassword(email, hashedPassword);

      cacheKey.del(token);

      return {
        success: true,
        message: "Password reset successfully",
      };
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
