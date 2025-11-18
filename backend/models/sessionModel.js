import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  astrologerId: { type: String, required: true },
  sessionType: { type: String, enum: ['chat', 'audio', 'video'], required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number, default: 0 }, // in seconds
  coinsUsed: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'active', 'ended'], default: 'pending' },
  channelName: { type: String, required: true },
  acceptedAt: { type: Date },
  acceptedBy: { type: String } // astrologer clerkId
}, { timestamps: true });

export default mongoose.model('Session', sessionSchema);

