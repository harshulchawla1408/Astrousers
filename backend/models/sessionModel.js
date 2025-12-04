import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    // ALWAYS store Mongo ObjectId string, not clerkId
    userId: { type: String, required: true, index: true },           // User _id (string)
    astrologerId: { type: String, required: true, index: true },     // Astrologer _id (string)

    sessionType: {
      type: String,
      enum: ["chat", "audio", "video"],
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

    // TIME FIELDS
    startTime: { type: Date, default: Date.now },   // session created time
    activeAt: { type: Date },                       // when astrologer accepts
    acceptedAt: { type: Date },
    acceptedBy: { type: String },                   // astrologerId or clerkId
    rejectedAt: { type: Date },
    rejectedBy: { type: String },
    endTime: { type: Date },

    // BILLING
    duration: { type: Number, default: 0 },         // seconds
    coinsUsed: { type: Number, default: 0 },
    endedBy: { type: String, enum: ["user", "astrologer", "system"] },

    // Agora / Call metadata (optional but production-grade)
    agora: {
      token: { type: String },
      channel: { type: String },
      uidUser: { type: String },
      uidAstrologer: { type: String }
    },

    // Review system
    review: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String }
    }
  },
  { timestamps: true }
);

// INDEXES
sessionSchema.index({ userId: 1, status: 1 });
sessionSchema.index({ astrologerId: 1, status: 1 });
sessionSchema.index({ createdAt: -1 });
sessionSchema.index({ channelName: 1 });

export default mongoose.model("Session", sessionSchema);
