import express, { NextFunction, Request, Response } from "express";

import testRouter from "./routes/testRouter";

const app = express();

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("1. Hello World!");
});

app.use("/test", testRouter);

const port = 5000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
