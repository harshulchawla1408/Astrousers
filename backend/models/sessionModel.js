import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // User's clerkId
  astrologerId: { type: String, required: true, index: true }, // Astrologer's MongoDB _id
  sessionType: { type: String, enum: ['chat', 'audio', 'video'], required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number, default: 0 }, // in seconds
  coinsUsed: { type: Number, default: 0 },
  totalCoinsUsed: { type: Number, default: 0 }, // Total coins used (same as coinsUsed, kept for compatibility)
  status: { type: String, enum: ['pending', 'active', 'ended', 'rejected'], default: 'pending' },
  channelName: { type: String, required: true, unique: true },
  acceptedAt: { type: Date },
  acceptedBy: { type: String }, // astrologer clerkId or _id
  rejectedAt: { type: Date },
  rejectedBy: { type: String },
  endedBy: { type: String }, // 'user' or 'astrologer'
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  }
}, { timestamps: true });

// Index for faster queries
sessionSchema.index({ userId: 1, status: 1 });
sessionSchema.index({ astrologerId: 1, status: 1 });
sessionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Session', sessionSchema);

