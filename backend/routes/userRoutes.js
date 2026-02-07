import express from "express";
import { registerUser } from "../controllers/userController.js";
import { authUser } from "../controllers/userController.js";
import { allUsers } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.route("/login").post(authUser);



export default router;