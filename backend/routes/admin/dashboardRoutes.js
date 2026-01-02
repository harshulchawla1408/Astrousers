import express from "express";
import { getAdminDashboardStats } from "../../controllers/admin/adminDashboardController.js";
import { requireAuth } from "../../middleware/clerkAuth.js";

const router = express.Router();

router.get("/", requireAuth, getAdminDashboardStats);

export default router;
