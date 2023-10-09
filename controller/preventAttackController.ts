import { NextFunction, Request, Response } from "express";

async function getDataXss(req: Request, res: Response, next: NextFunction) {
  const { name } = req.query;
  try {
    res.send(`Hello ${name}`);
  } catch (error) {
    next(error);
  }
}

async function getClickJacking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.send(`
           <form action="/click-jacking" method="post">
             <label for="username">Username:</label><br>
             <input type="text" id="username" name="username"><br>
             <label for="password">Password:</label><br>
             <input type="password" id="password" name="password"><br>
             <input type="submit" value="Submit">
           </form>
         `);
  } catch (error) {
    next(error);
  }
}

async function createClickJacking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let username = req.body.username;
    let password = req.body.password;
    res.json({ username: username, password: password });
  } catch (error) {
    next(error);
  }
}

export { getDataXss, getClickJacking, createClickJacking };
