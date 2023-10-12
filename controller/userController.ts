import UserDao from "../dao/userDao";
import UserService from "../service/userService";
import { NextFunction, Request, Response } from "express";

async function findAllUsers(req: Request, res: Response, next: NextFunction) {
  const { db } = req;
  try {
    const userDao = new UserDao(db);
    const userService = new UserService(userDao);
    const result = await userService.findAllUsers();
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Successfully get all users",
        data: result.message,
      });
    }
  } catch (error: any) {
    next(error);
  }
}

async function updateRole(req: Request, res: Response, next: NextFunction) {
  const { db } = req;
  const { id } = req.params;
  const { role } = req.body;
  try {
    const userDao = new UserDao(db);
    const userService = new UserService(userDao);
    const result = await userService.updateRole(id, role);
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Successfully update role",
        data: result.message,
      });
    }
  } catch (error: any) {
    next(error);
  }
}

export { findAllUsers, updateRole };
