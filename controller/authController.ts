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
  } catch (error) {
    next(error);
  }
}

export { loginUser, registerUser };
