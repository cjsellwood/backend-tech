import { NextFunction, Request, Response } from "express";
import StatusError from "../utils/StatusError";
import catchAsync from "../utils/catchAsync";

export const home = (req: Request, res: Response, next: NextFunction) => {
  res.send("Testing route");
};

export const time = (req: Request, res: Response, next: NextFunction) => {
  res.send(new Date(Date.now()).toLocaleTimeString());
};

export const users = (req: Request, res: Response, next: NextFunction) => {
  res.json([
    { id: 1, name: "Bob" },
    { id: 2, name: "Bill" },
  ]);
};

export const error = (req: Request, res: Response, next: NextFunction) => {
  if (Math.random() < 0.5) {
    throw new StatusError("Test Error", 404);
  }
  res.send("HI");
};

export const asyncError = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const n: number = await new Promise((resolve, reject) =>
      setTimeout(() => {
        const n = Math.random();
        if (n < 0.5) {
          reject(new StatusError("Async Error", 405));
        }
        resolve(n);
      }, 500)
    );

    res.send("HELLO " + n);
  }
);
