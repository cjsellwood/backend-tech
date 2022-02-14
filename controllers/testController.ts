import { NextFunction, Request, Response } from "express";

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
