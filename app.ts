import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { connect } from "mongoose";

import testRouter from "./routes/testRouter";
import mongoRouter from "./routes/mongoRouter";
import sqlRouter from "./routes/sqlRouter";
import StatusError from "./utils/StatusError";

const app = express();

app.use(express.json());
app.use(morgan("dev", { skip: () => process.env.NODE_ENV === "test" }));

/* istanbul ignore next */
// Start mongodb
if (process.env.NODE_ENV !== "test") {
  async function main() {
    await connect(process.env.MONGO_URI!);
  }
  main().catch((err) => console.log(err));
}

app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  res.send("1. Hello World!");
});

app.use("/test", testRouter);
app.use("/mongo", mongoRouter);
app.use("/sql", sqlRouter);

// Error handler
app.use(
  (error: StatusError, _req: Request, res: Response, _next: NextFunction) => {
    // console.log("ERROR:", error.status, error.message);
    res.status(error.status || 500).send(error.message);
  }
);

export default app;
