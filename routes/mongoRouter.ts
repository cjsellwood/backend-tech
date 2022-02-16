import express from "express";
const router = express.Router();
import {
  getUsers,
  getUser,
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
} from "../controllers/mongoController";

import {
  validateAddPost,
  validateChange,
  validateDeletePost,
} from "../middleware";

router.get("/users", getUsers);

router.get("/users/:id", getUser);

router.get("/posts", getPosts);

router.get("/posts/:id", getPost);

router.post("/posts/", validateAddPost, addPost);

router.patch("/posts/:id", validateAddPost, validateChange, updatePost);

router.delete("/posts/:id", validateDeletePost, validateChange, deletePost);

export default router;
