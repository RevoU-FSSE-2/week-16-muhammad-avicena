import AuthDao from "../dao/authDao";
import AuthService from "../service/authService";
import { NextFunction, Request, Response } from "express";

async function loginUser(req: Request, res: Response, next: NextFunction) {
  const { db } = req;
  const { username, password } = req.body;
  try {
    const authDao = new AuthDao(db);
    const authService = new AuthService(authDao);
    const result = await authService.loginUser(username, password);
    if (result.success) {
      res.cookie("access_token", result.message.accessToken, {
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
      });
      res.cookie("refresh_token", result.message.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(200).json({
        success: true,
        message: "Successfully login",
        data: result.message,
      });
    }
  } catch (error) {
    next(error);
  }
}

async function registerUser(req: Request, res: Response, next: NextFunction) {
  const { db } = req;
  const { username, password } = req.body;
  try {
    const authDao = new AuthDao(db);
    const authService = new AuthService(authDao);
    const result = await authService.registerUser(username, password);
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Successfully register a user",
        data: { _id: result.message },
      });
    }
  } catch (error: any) {
    next(error);
  }
}

async function logoutUser(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res.status(200).json({
      success: true,
      message: "Successfully logout",
    });
  } catch (error: any) {
    next(error);
  }
}

async function refreshAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { db } = req;
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token is missing.",
    });
  }

  try {
    const authDao = new AuthDao(db);
    const authService = new AuthService(authDao);
    const result = await authService.refreshAccessToken(refreshToken);

    if (result.success) {
      res.cookie("access_token", result.message.accessToken, {
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(200).json({
        success: true,
        message: "Access token refreshed successfully.",
        data: result.message,
      });
    }
    return res.status(401).json({
      success: false,
      message: "Failed to refresh access token. Please re-login.",
    });
  } catch (error) {
    next(error);
  }
}

export { loginUser, registerUser, logoutUser, refreshAccessToken };
