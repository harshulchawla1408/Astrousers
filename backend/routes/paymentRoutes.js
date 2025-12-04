import express from "express";
import {
  createOrder,
  verifyPayment,
  getBalance,
  getHistory
} from "../controllers/paymentController.js";

const router = express.Router();

// 1) Create Razorpay Order
router.post("/order", createOrder);

// 2) Verify Payment + Credit Wallet
router.post("/verify", verifyPayment);

// 3) Get Wallet Balance
router.get("/balance", getBalance);

// 4) Get Transaction History
router.get("/history", getHistory);

export default router;
