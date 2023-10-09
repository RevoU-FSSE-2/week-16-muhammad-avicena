import { Application, Response, Request, NextFunction } from "express";

function cspPolicyMiddleware(app: Application) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      "Content-Security-Policy",
      "script-src 'self' https://avicena.dev"
    );
    next();
  });
}

export default cspPolicyMiddleware;
