import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String },
    name: { type: String },
    profileImage: { type: String },
    dob: { type: Date },
    tob: { type: String },
    city: { type: String },
    wallet: { type: Number, default: 30 },
    transactions: [transactionSchema],
    // Presence and session fields
    isOnline: { type: Boolean, default: false },
    socketId: { type: String, default: null },
    currentSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', default: null },
    lastSeen: { type: Date, default: Date.now },
    role: { type: String, enum: ['user', 'astrologer', 'admin'], default: 'user' }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
