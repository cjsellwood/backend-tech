import { NextFunction, Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";
import catchAsync from "../utils/catchAsync";
import StatusError from "../utils/StatusError";

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

    res.json(newPost);
  }
);

export const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { text, title, userId } = req.body;

    if (!test || !title) {
      return next(new StatusError("No title or text", 400));
    }
    if (!userId) {
      return next(new StatusError("Needs userId", 401));
    }

    const oldPost = await Post.findById(id);
    if (!oldPost) {
      return next(new StatusError("Post not found", 404));
    }

    if (oldPost.userId.toString() !== userId) {
      return next(new StatusError("Not authorized", 401));
    }

    const replaced = await Post.findByIdAndUpdate(
      id,
      { text, title },
      { returnDocument: "after" }
    );

    res.json(replaced);
  }
);

export const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return next(new StatusError("Needs userId", 401));
    }

    const post = await Post.findById(id);
    console.log(post);

    if (!post) {
      return next(new StatusError("Post not found", 404));
    }

    if (post.userId.toString() !== userId) {
      return next(new StatusError("Not authorized", 401));
    }

    res.status(204).send();
  }
);
