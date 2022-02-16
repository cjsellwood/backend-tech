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

router.get("/users", getUsers);

router.get("/users/:id", getUser);

router.get("/posts", getPosts);

router.get("/posts/:id", getPost);

router.post("/posts/", addPost);

router.patch("/posts/:id", updatePost);

router.delete("/posts/:id", deletePost);

export default router;
