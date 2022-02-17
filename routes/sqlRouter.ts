import express from "express";
import { users, posts } from "../controllers/sqlController";

const router = express.Router();

router.get("/users", users)

router.get("/posts", posts);

export default router;