import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.js";

// validate credentials early
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error("ERROR: Missing Razorpay credentials");
  console.error("Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file");
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

/**
 * ---------------------------------------------------------
 * 1) CREATE ORDER
 * ---------------------------------------------------------
 */
export const createOrder = async (req, res) => {
  try {
    const { amount, clerkId } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Minimum amount ₹1 required"
      });
    }

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: "clerkId is required"
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `order_${Date.now()}_${clerkId}`,
      notes: {
        clerkId,
        recharge: "wallet"
      }
    });

    return res.json({
      success: true,
      order
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: err.message
    });
  }
};

/**
 * ---------------------------------------------------------
 * 2) VERIFY PAYMENT + CREDIT WALLET
 * ---------------------------------------------------------
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount,
      clerkId
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Incomplete Razorpay details"
      });
    }

    // Validate signature
    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: "clerkId missing"
      });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Convert INR → COINS logic (1 INR = 1 coin)
    const coins = Number(amount) || 0;

    user.wallet = (user.wallet || 0) + coins;

    // Log transaction
    if (!Array.isArray(user.transactions)) user.transactions = [];
    user.transactions.push({
      type: "credit",
      amount: coins,
      description: `Wallet Recharge - Payment ID: ${razorpay_payment_id}`,
      date: new Date()
    });

    await user.save();

    return res.json({
      success: true,
      message: "Payment verified, wallet credited",
      newBalance: user.wallet,
      coins
    });
  } catch (err) {
    console.error("Payment verify error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: err.message
    });
  }
};

/**
 * ---------------------------------------------------------
 * 3) GET WALLET BALANCE
 * ---------------------------------------------------------
 */
export const getBalance = async (req, res) => {
  try {
    const clerkId = req.query.clerkId || req.headers["x-user-id"];

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: "clerkId required"
      });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      wallet: user.wallet,
      transactions: user.transactions.slice(-10)
    });
  } catch (err) {
    console.error("Wallet fetch error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wallet"
    });
  }
};

/**
 * ---------------------------------------------------------
 * 4) GET FULL TRANSACTION HISTORY
 * ---------------------------------------------------------
 */
export const getHistory = async (req, res) => {
  try {
    const { clerkId, page = 1, limit = 20 } = req.query;

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: "clerkId required"
      });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const start = (page - 1) * limit;
    const end = start + Number(limit);

    const transactions = user.transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(start, end);

    return res.json({
      success: true,
      transactions,
      total: user.transactions.length,
      currentPage: Number(page),
      totalPages: Math.ceil(user.transactions.length / limit)
    });
  } catch (err) {
    console.error("History fetch error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch history"
    });
  }
};
