import express from "express";
import {
  createOrder,
  verifyPayment,
  getWallet
} from "../controllers/paymentController.js";

import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

router.post("/order", requireAuth, createOrder);
router.post("/verify", requireAuth, verifyPayment);
router.get("/wallet", requireAuth, getWallet);

export default router;
