import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";

import testRouter from "./routes/testRouter";
import StatusError from "./utils/StatusError";

const app = express();

app.use(morgan("dev"))

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("1. Hello World!");
});

app.use("/test", testRouter);

// Error handler
app.use(
  (error: StatusError, req: Request, res: Response, next: NextFunction) => {
    console.log("ERROR:", error.status, error.message);
    res.status(error.status).send(error.message);
  }
);

const port = 5000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
