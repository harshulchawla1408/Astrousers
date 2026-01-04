import express from "express";
import {
  createOrder,
  verifyPayment,
  getWallet,
  getBalance
} from "../controllers/paymentController.js";

import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

router.post("/order", requireAuth, createOrder);
router.post("/verify", requireAuth, verifyPayment);
router.get("/wallet", requireAuth, getWallet);
router.get("/balance", getBalance); // Optional auth - supports clerkId query param

export default router;
