import { Request, NextFunction, Response } from "express";
import connectToDb from "../db";

const databaseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const db = await connectToDb();
  req.db = db;
  next();
};

export default databaseMiddleware;
