import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { connect } from "mongoose";

import testRouter from "./routes/testRouter";
import mongoRouter from "./routes/mongoRouter";
import StatusError from "./utils/StatusError";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

async function main() {
  await connect("mongodb://localhost:27017/backendTest");
}

main().catch((err) => console.log(err));

app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  res.send("1. Hello World!");
});

app.use("/test", testRouter);
app.use("/mongo", mongoRouter);

// Error handler
app.use(
  (error: StatusError, _req: Request, res: Response, _next: NextFunction) => {
    console.log("ERROR:", error.status, error.message);
    res.status(error.status).send(error.message);
  }
);

export default app;
