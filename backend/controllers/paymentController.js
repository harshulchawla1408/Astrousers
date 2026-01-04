import dotenv from 'dotenv';
dotenv.config();

import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.js";

let razorpayInstance = null;

const getRazorpay = () => {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.warn("⚠️ Razorpay keys not configured. Payment features disabled.");
      return null;
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }
  return razorpayInstance;
};

/*
====================================================
CREATE ORDER
====================================================
*/
export const createOrder = async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount < 10) {
    return res.status(400).json({ success: false });
  }

  const razorpay = getRazorpay();
  if (!razorpay) {
    return res.status(500).json({ success: false, message: "Payment service unavailable" });
  }

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR"
  });

  res.json({ success: true, order });
};

/*
====================================================
VERIFY PAYMENT
====================================================
*/
export const verifyPayment = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ success: false, message: "Payment service unavailable" });
    }

    const sign = crypto
      .createHmac("sha256", keySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    user.walletBalance += amount;
    user.walletTransactions.push({
      type: "CREDIT",
      amount,
      reason: "Wallet Recharge",
      balanceAfter: user.walletBalance
    });

    await user.save();

    res.json({ success: true, balance: user.walletBalance, newBalance: user.walletBalance });
  } catch (err) {
    console.error("verifyPayment error:", err);
    res.status(500).json({ success: false, message: "Failed to verify payment" });
  }
};

/*
====================================================
GET WALLET (AUTH REQUIRED)
====================================================
*/
export const getWallet = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      wallet: user.walletBalance,
      balance: user.walletBalance,
      transactions: user.walletTransactions.reverse().slice(0, 20)
    });
  } catch (err) {
    console.error("getWallet error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch wallet" });
  }
};

/*
====================================================
GET BALANCE (OPTIONAL AUTH - SUPPORTS QUERY PARAM)
====================================================
*/
export const getBalance = async (req, res) => {
  try {
    let user;

    // Support both auth token and clerkId query param
    if (req.userId) {
      // Authenticated request
      user = await User.findOne({ clerkId: req.userId });
    } else if (req.query.clerkId) {
      // Query param request (for public access)
      user = await User.findOne({ clerkId: req.query.clerkId });
    } else {
      return res.status(400).json({ success: false, message: "Missing clerkId or authentication" });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      wallet: user.walletBalance,
      balance: user.walletBalance
    });
  } catch (err) {
    console.error("getBalance error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch balance" });
  }
};
