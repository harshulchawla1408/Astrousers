import express from "express";
import { createOrUpdateUser, getUserProfile, updateUserWallet, updateUserProfile } from "../controllers/userController.js";
import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

// Sync or create user after signup/login
router.post("/sync", requireAuth, createOrUpdateUser);

// Get current user's profile
router.get("/me", requireAuth, getUserProfile);

// Update current user's profile
router.patch("/me", requireAuth, updateUserProfile);

// Update wallet (increment or set)
router.patch("/wallet", requireAuth, updateUserWallet);

export default router;
