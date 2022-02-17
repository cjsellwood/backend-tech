import express from "express";
import {
  users,
  posts,
  addPost,
  updatePost,
  deletePost,
} from "../controllers/sqlController";
import {
  validateAddPost,
  validateUpdate,
  validateDeletePost,
} from "../middleware";

const router = express.Router();

router.get("/users", users);

router.get("/posts", posts);

router.post("/posts", validateAddPost, addPost);

router.patch("/posts/:id", validateAddPost, validateUpdate, updatePost);

router.delete("/posts/:id", validateDeletePost, validateUpdate, deletePost);

export default router;
