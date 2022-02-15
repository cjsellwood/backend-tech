import express from "express";
import {
  error,
  home,
  time,
  users,
  asyncError,
  loginUser,
} from "../controllers/testController";

const router = express.Router();

router.get("/", home);

router.get("/time", time);

router.get("/users", users);

router.get("/error", error);

router.get("/asyncError", asyncError);

router.post("/login", loginUser);

export default router;
