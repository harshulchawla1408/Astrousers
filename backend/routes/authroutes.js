import express from "express";
import { handleAuth, registerUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/auth", handleAuth);
router.post("/register", registerUser);

export default router;
