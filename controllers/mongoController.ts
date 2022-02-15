import { NextFunction, Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";
import catchAsync from "../utils/catchAsync";

export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});
    res.json(users);
  }
);

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json(user);
  }
);

export const getPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await Post.find({});
    res.json(posts);
  }
);

export const getPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.json(post);
  }
);

export const addPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { userId, title, text } = req.body;

    const newPost = await Post.create({
      userId,
      title,
      text,
      date: new Date(Date.now()),
    });

    newPost.save();
  }
);
