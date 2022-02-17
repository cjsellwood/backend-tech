import { Response, Request, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { query } from "../sql/db";

export const users = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await query("SELECT * FROM users", []);
    res.json(users.rows);
  }
);

export const posts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await query("SELECT * FROM posts", []);
    res.json(posts.rows);
  }
);
