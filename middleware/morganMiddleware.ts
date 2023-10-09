import { Application } from "express";
// import fs from "fs";
import morgan from "morgan";

const morganMiddleware = (app: Application) => {
  // const accessLogStream = fs.createWriteStream("request.log", {
  //   flags: "a",
  // });
  // const logger = morgan("combined", { stream: accessLogStream });
  app.use(morgan("dev"));
};

export default morganMiddleware;
