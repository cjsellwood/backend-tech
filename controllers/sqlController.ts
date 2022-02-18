import { Response, Request, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { query } from "../sql/db";

export const users = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await query("SELECT * FROM users", []);
    console.log(users);
    res.json(users.rows);
  }
);

export const posts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await query("SELECT * FROM posts", []);
    res.json(posts.rows);
  }
);

export const addPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, text, title } = req.body;
    const newPost = await query(
      `INSERT INTO posts(user_id, title, text, date) VALUES ($1, $2, $3, $4) RETURNING id, user_id as "userId", title, text, date;`,
      [userId, title, text, new Date(Date.now())]
    );

    res.json(newPost.rows);
  }
);

export const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { userId, text, title } = req.body;
    const updatedPost = await query(
      `UPDATE posts SET title = $1, text = $2 WHERE user_id = $3 AND id = $4 RETURNING id, user_id as "userId", title, text, date;`,
      [title, text, userId, Number(id)]
    );
    res.json(updatedPost.rows);
  }
);

export const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.body;
    const deletedPost = await query(`DELETE FROM posts WHERE id = $1`, [
      Number(id),
    ]);
    res.status(204).send();
  }
);
