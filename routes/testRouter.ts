import express from "express";
import {
  error,
  home,
  time,
  users,
  asyncError,
} from "../controllers/testController";

const router = express.Router();

router.get("/", home);

router.get("/time", time);

router.get("/users", users);

router.get("/error", error);

router.get("/asyncError", asyncError);

export default router;
