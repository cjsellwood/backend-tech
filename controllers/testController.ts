import { NextFunction, Request, Response } from "express";
import StatusError from "../utils/StatusError";

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

export const asyncError = (req: Request, res: Response, next: NextFunction) => {
  
}