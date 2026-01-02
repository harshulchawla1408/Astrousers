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
  const user = req.user;
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
    return res.status(400).json({ success: false });
  }

  user.walletBalance += amount;
  user.walletTransactions.push({
    type: "CREDIT",
    amount,
    reason: "Wallet Recharge",
    balanceAfter: user.walletBalance
  });

  await user.save();

  res.json({ success: true, balance: user.walletBalance });
};

/*
====================================================
GET WALLET
====================================================
*/
export const getWallet = async (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    balance: user.walletBalance,
    transactions: user.walletTransactions.reverse().slice(0, 20)
  });
};
