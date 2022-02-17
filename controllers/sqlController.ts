import { Response, Request, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";

export const home = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("sql")
  }
);
