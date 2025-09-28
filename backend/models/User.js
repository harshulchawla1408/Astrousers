import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true }, // Clerk User ID
    email: { type: String, required: true, unique: true },
    fullName: { type: String },
    profileImage: { type: String },
    dob: { type: Date },  // optional for kundli
    tob: { type: String }, // optional for kundli
    city: { type: String }, // optional
    coinBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
