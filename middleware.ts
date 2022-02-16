import { addPostSchema, deletePostSchema } from "./joi";
import { NextFunction, Request, Response } from "express";
import Post from "./models/Post";
import StatusError from "./utils/StatusError";

export const validateAddPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValid = addPostSchema.validate(req.body);
  if (isValid.error) {
    return next(new StatusError(isValid.error.message, 400));
  }
  next();
};

export const validateDeletePost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValid = deletePostSchema.validate(req.body);
  if (isValid.error) {
    return next(new StatusError(isValid.error.message, 400));
  }
  next();
};

export const validateChange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { userId } = req.body;
  const oldPost = await Post.findById(id);
  if (!oldPost) {
    return next(new StatusError("Post not found", 404));
  }

  if (oldPost.userId.toString() !== userId) {
    return next(new StatusError("Not authorized", 401));
  }
  next();
};
