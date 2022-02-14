import express from "express";
import { home, time, users } from "../controllers/testController";

const router = express.Router();

router.get("/", home);

router.get("/time", time);

router.get("/users", users);

export default router;
