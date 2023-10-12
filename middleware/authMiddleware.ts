import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import StandardError from "../constants/standardError";
import { JWT_SIGN } from "./config/jwtConfig.js";

interface JwtInterface extends JwtPayload {
  role: string;
}

const userAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.cookies.access_token;

  if (!authHeader) {
    throw new StandardError({
      success: false,
      status: 401,
      message: "Unauthorized",
    });
  } else {
    try {
      if (!JWT_SIGN) {
        throw new Error("JWT_SIGN is not defined");
      }
      const decodedToken = jwt.verify(authHeader, JWT_SIGN);
      console.log("Verified user:", decodedToken);
      next();
    } catch (error) {
      next(error);
    }
  }
};

const authorizationMiddleware =
  (allowedRoles: string | string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.cookies.access_token;

    if (!authHeader) {
      throw new StandardError({
        success: false,
        status: 401,
        message: "Unauthorized",
      });
    } else {
      try {
        if (!JWT_SIGN) {
          throw new Error("JWT_SIGN is not defined");
        }
        const decodedToken = jwt.verify(authHeader, JWT_SIGN) as JwtInterface;
        if (allowedRoles.includes(decodedToken.role)) {
          next();
        } else {
          throw new StandardError({
            success: false,
            status: 403,
            message:
              "Access Denied. You are not allowed to access this resource.",
          });
        }
      } catch (error) {
        next(error);
      }
    }
  };

const adminAuthorization = authorizationMiddleware(["admin", "manager"]);
const managerAuthorization = authorizationMiddleware(["manager"]);

export { userAuthentication, adminAuthorization, managerAuthorization };
