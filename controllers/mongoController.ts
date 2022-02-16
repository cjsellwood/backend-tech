import { NextFunction, Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";
import catchAsync from "../utils/catchAsync";
import StatusError from "../utils/StatusError";

export const getUsers = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const users = await User.find({});
    res.json(users);
  }
);

export const getUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json(user);
  }
);

export const getPosts = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const posts = await Post.find({});
    res.json(posts);
  }
);

export const getPost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.json(post);
  }
);

export const addPost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { userId, title, text } = req.body;

    const newPost = await Post.create({
      userId,
      title,
      text,
      date: new Date(Date.now()),
    });

    newPost.save();

    res.json(newPost);
  }
);

export const updatePost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const { text, title } = req.body;

    const replaced = await Post.findByIdAndUpdate(
      id,
      { text, title },
      { returnDocument: "after" }
    );

    res.json(replaced);
  }
);

export const deletePost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    await Post.findByIdAndDelete(id);

    res.status(204).send();
  }
);
