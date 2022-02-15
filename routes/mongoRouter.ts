import express from "express";
const router = express.Router();
import {
  getUsers,
  getUser,
  getPosts,
  getPost,
  addPost,
} from "../controllers/mongoController";

router.get("/users", getUsers);

router.get("/user/:id", getUser);

router.get("/posts", getPosts);

router.get("/posts/:id", getPost);

router.post("/posts/", addPost);

export default router;
