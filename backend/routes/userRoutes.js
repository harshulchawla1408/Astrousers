import express from "express";
import { createOrUpdateUser, getUserProfile, updateUserWallet, updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

// Create or update user after signup/login (primary route)
router.post("/", createOrUpdateUser);

// Sync route (points to same function)
router.post("/sync", createOrUpdateUser);

// Get current user's profile
router.get("/me", getUserProfile);

// Update current user's profile
router.patch("/me", updateUserProfile);

// Update wallet (increment or set)
router.patch("/wallet", updateUserWallet);

export default router;
