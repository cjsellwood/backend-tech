import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";

import testRouter from "./routes/testRouter";
import StatusError from "./utils/StatusError";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  res.send("1. Hello World!");
});

app.use("/test", testRouter);

// Error handler
app.use(
  (error: StatusError, _req: Request, res: Response, _next: NextFunction) => {
    console.log("ERROR:", error.status, error.message);
    res.status(error.status).send(error.message);
  }
);

export default app;
