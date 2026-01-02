import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["CREDIT", "DEBIT"], required: true },
  amount: { type: Number, required: true },
  reason: String,
  balanceAfter: Number,
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    name: String,
    email: String,
    avatar: String,

    role: {
      type: String,
      enum: ["USER", "ASTROLOGER", "ADMIN"],
      default: "USER"
    },

    walletBalance: { type: Number, default: 0 },
    walletTransactions: [walletTransactionSchema],

    lastSeen: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
