import { Application } from "express";
import bodyParserMiddleware from "./bodyParserMiddleware";
import helmetMiddleware from "./helmetMiddleware";
import corsMiddleware from "./corsMiddleware";
import morganMiddleware from "./morganMiddleware";
import requestIdMiddleware from "./requestIdMiddleware";
import databaseMiddleware from "./databaseMiddleware";
import cspPolicyMiddleware from "./cspPolicyMiddleware";
import cookieMiddleware from "./cookieMiddleware";

const applyMiddleware = (app: Application) => {
  morganMiddleware(app);
  app.use(requestIdMiddleware);
  helmetMiddleware(app);
  bodyParserMiddleware(app);
  cookieMiddleware(app);
  corsMiddleware(app);
  cspPolicyMiddleware(app);
  app.use(databaseMiddleware);
};

export default applyMiddleware;
