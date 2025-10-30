import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.js";
import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

// read keys from env (set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  // throw early with actionable message
  throw new Error(
    "Missing Razorpay credentials: set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment (.env or secrets)."
  );
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Step 1: Create Razorpay Order
router.post("/create-order", requireAuth, async (req, res) => {
  try {
    const { amount } = req.body; // amount in INR

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. Minimum ₹1 required.",
      });
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}_${req.userId}`,
      notes: {
        userId: req.userId,
        type: "wallet_recharge",
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// Step 2: Verify Payment and Credit Coins
router.post("/verify", requireAuth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification data",
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Credit wallet (1 INR = 1 coin)
    const user = await User.findOne({ clerkId: req.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Add coins to wallet
    user.wallet += amount;

    // Add transaction record
    user.transactions.push({
      type: "credit",
      amount: amount,
      description: `Wallet Recharge via Razorpay - Order: ${razorpay_order_id}`,
    });

    await user.save();

    res.json({
      success: true,
      message: "Payment verified and coins credited",
      newBalance: user.wallet,
      transactionId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
});

// Get user wallet balance
router.get("/balance", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      balance: user.wallet,
      transactions: user.transactions.slice(-10), // Last 10 transactions
    });
  } catch (error) {
    console.error("Balance fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch balance",
      error: error.message,
    });
  }
});

// Get transaction history
router.get("/history", requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const user = await User.findOne({ clerkId: req.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Paginate transactions
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTransactions = user.transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(startIndex, endIndex);

    res.json({
      success: true,
      transactions: paginatedTransactions,
      totalTransactions: user.transactions.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(user.transactions.length / limit),
    });
  } catch (error) {
    console.error("Transaction history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction history",
      error: error.message,
    });
  }
});

export default router;
