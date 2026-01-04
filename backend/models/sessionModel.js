import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    astrologerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Astrologer",
      required: true,
      index: true
    },

    sessionType: {
      type: String,
      enum: ["chat", "call", "video"],
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "active", "ended", "rejected"],
      default: "pending",
      index: true
    },

    channelName: {
      type: String,
      required: true,
      unique: true
    },

    startTime: { type: Date, default: Date.now },
    activeAt: { type: Date },
    endTime: { type: Date },

    durationMinutes: { type: Number, default: 0 },
    coinsUsed: { type: Number, default: 0 },

    endedBy: {
      type: String,
      enum: ["USER", "ASTROLOGER", "SYSTEM"]
    }
  },
  { timestamps: true }
);

sessionSchema.index({ userId: 1, createdAt: -1 });
sessionSchema.index({ astrologerId: 1, createdAt: -1 });

export default mongoose.model("Session", sessionSchema);
