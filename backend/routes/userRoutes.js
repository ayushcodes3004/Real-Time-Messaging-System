import express from "express";
import { registerUser } from "../controllers/userController.js";
import { authUser } from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);


export default router;