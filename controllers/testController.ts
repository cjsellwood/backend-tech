import { NextFunction, Request, Response } from "express";
import StatusError from "../utils/StatusError";
import catchAsync from "../utils/catchAsync";

export const home = (_req: Request, res: Response, _next: NextFunction) => {
  res.send("Testing route");
};

export const time = (_req: Request, res: Response, _next: NextFunction) => {
  res.send(new Date(Date.now()).toLocaleTimeString());
};

export const users = (_req: Request, res: Response, _next: NextFunction) => {
  res.json([
    { id: 1, name: "Bob" },
    { id: 2, name: "Bill" },
  ]);
};

export const error = (_req: Request, _res: Response, _next: NextFunction) => {
  throw new StatusError("Test Error", 404);
};

export const asyncError = catchAsync(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    await new Promise((_resolve, reject) =>
      setTimeout(() => {
        reject(new StatusError("Async Error", 405));
      }, 500)
    );
  }
);
