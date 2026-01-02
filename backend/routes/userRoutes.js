import express from "express";
import { syncUser, getMe } from "../controllers/userController.js";
import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

/*
========================================
USER SYNC (CLERK → MONGODB)
========================================
*/
router.post("/sync", syncUser);

/*
========================================
GET CURRENT USER (AUTHENTICATED)
========================================
*/
router.get("/me", requireAuth, getMe);

export default router;
