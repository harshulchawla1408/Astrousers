import mongoose from "mongoose";

const earningSchema = new mongoose.Schema({
  amount: Number,
  source: { type: String, enum: ["CHAT", "CALL", "VIDEO"] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const astrologerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true
    },

    expertise: [String],
    category: String,
    gender: String,
    experience: Number,
    languages: [String],

    pricePerMinute: {
      chat: Number,
      call: Number,
      video: Number
    },

    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },

    isOnline: { type: Boolean, default: false },
    socketId: { type: String, default: null },

    totalEarnings: { type: Number, default: 0 },
    earnings: [earningSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Astrologer", astrologerSchema);