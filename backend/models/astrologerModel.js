import mongoose from "mongoose";

const astrologerSchema = new mongoose.Schema({
  clerkId: { 
    type: String, 
    unique: true, 
    sparse: true, 
    index: true,
    trim: true
  }, // Link to Clerk user (optional for existing astrologers)
  name: { type: String, required: true },
  expertise: { type: String, required: true },
  category: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  experience: { type: Number, required: true },
  languages: [String],
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  pricePerMin: { type: Number, required: true },
  verified: { type: Boolean, default: true },
  image: { type: String, required: true },
  description: { type: String },
  availability: {
    chat: { type: Boolean, default: true },
    call: { type: Boolean, default: true },
    video: { type: Boolean, default: false }
  },
  online: { type: Boolean, default: false },
  specialties: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
astrologerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Astrologer", astrologerSchema); 