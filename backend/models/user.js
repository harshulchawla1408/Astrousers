import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema(
  {
    clerkId: { 
      type: String, 
      required: [true, 'clerkId is required'], 
      unique: true,
      trim: true,
      index: true
    },
    email: { 
      type: String, 
      default: "",
      trim: true
    },
    firstName: { 
      type: String, 
      default: "",
      trim: true
    },
    lastName: { 
      type: String, 
      default: "",
      trim: true
    },
    name: { 
      type: String, 
      default: "",
      trim: true
    },
    profileImage: { 
      type: String, 
      default: "",
      trim: true
    },
    // Optional fields - not required for signup
    dob: { type: Date, default: null },
    tob: { type: String, default: null },
    city: { type: String, default: null },
    wallet: { 
      type: Number, 
      default: 30,
      min: 0
    },
    transactions: { 
      type: [transactionSchema], 
      default: []
    },
    // Presence and session fields
    isOnline: { 
      type: Boolean, 
      default: false 
    },
    socketId: { 
      type: String, 
      default: null 
    },
    currentSessionId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Session', 
      default: null 
    },
    lastSeen: { 
      type: Date, 
      default: Date.now 
    },
    role: { 
      type: String, 
      enum: ['user', 'astrologer', 'admin'], 
      default: 'user' 
    }
  },
  { 
    timestamps: true,
    // Ensure validation doesn't fail on optional fields
    strict: true
  }
);

export default mongoose.model("User", userSchema);
