import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true }, // Clerk User ID
    email: { type: String, required: true, unique: true },
    fullName: { type: String },
    profileImage: { type: String },
    dob: { type: Date },  // optional for kundli
    tob: { type: String }, // optional for kundli
    city: { type: String }, // optional
    coins: { type: Number, default: 100 }, // wallet balance with default 100 coins
    transactions: [transactionSchema], // transaction history
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
