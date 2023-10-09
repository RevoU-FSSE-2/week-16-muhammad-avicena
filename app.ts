import "dotenv/config";
import express, { Application } from "express";
import routes from "./routes";
import useMiddleware from "./middleware";
import errorHandlerMiddleware from "./middleware/errorHandleMiddleware";

const app: Application = express();
const PORT: number = parseInt(<string>process.env.PORT, 10) || 8080;

// Use middlewares
useMiddleware(app);

// Use routes
app.use(routes);

// Use error handler
app.use(errorHandlerMiddleware);

// App listeners
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

export default app;
