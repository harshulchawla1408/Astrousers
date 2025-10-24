import mongoose from "mongoose";
import dotenv from "dotenv";
import Astrologer from "../models/astrologerModel.js";

dotenv.config();

const sampleAstrologers = [
  {
    name: "Dr. Priya Sharma",
    expertise: "Vedic Astrology Specialist",
    category: "Vedic Astrology",
    gender: "Female",
    experience: 15,
    languages: ["Hindi", "English", "Sanskrit"],
    rating: 4.8,
    reviews: 1250,
    pricePerMin: 25,
    verified: true,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    description: "Expert in Vedic astrology with 15 years of experience. Specializes in career guidance, marriage compatibility, and health predictions.",
    availability: {
      chat: true,
      call: true,
      video: true
    },
    online: true,
    specialties: ["Career Guidance", "Marriage Compatibility", "Health Predictions", "Financial Planning"]
  },
  {
    name: "Pandit Rajesh Kumar",
    expertise: "Jyotish Expert",
    category: "Traditional Astrology",
    gender: "Male",
    experience: 20,
    languages: ["Hindi", "English", "Sanskrit"],
    rating: 4.9,
    reviews: 2100,
    pricePerMin: 30,
    verified: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    description: "Renowned Jyotish expert with deep knowledge of ancient texts. Provides accurate predictions and remedies.",
    availability: {
      chat: true,
      call: true,
      video: true
    },
    online: true,
    specialties: ["Remedies", "Gemstone Consultation", "Muhurat Selection", "Vastu Shastra"]
  },
  {
    name: "Dr. Anjali Mehta",
    expertise: "Modern Astrology & Psychology",
    category: "Modern Astrology",
    gender: "Female",
    experience: 12,
    languages: ["English", "Hindi", "Gujarati"],
    rating: 4.7,
    reviews: 980,
    pricePerMin: 20,
    verified: true,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    description: "Combines traditional astrology with modern psychology to provide holistic guidance for life decisions.",
    availability: {
      chat: true,
      call: true,
      video: true
    },
    online: true,
    specialties: ["Relationship Counseling", "Career Transition", "Personal Growth", "Stress Management"]
  },
  {
    name: "Acharya Vikram Singh",
    expertise: "Nadi Astrology Specialist",
    category: "Nadi Astrology",
    gender: "Male",
    experience: 18,
    languages: ["Hindi", "English", "Tamil"],
    rating: 4.6,
    reviews: 750,
    pricePerMin: 35,
    verified: true,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    description: "Specialist in Nadi astrology with expertise in palm leaf readings and ancient predictions.",
    availability: {
      chat: true,
      call: true,
      video: true
    },
    online: true,
    specialties: ["Nadi Readings", "Past Life Analysis", "Soul Purpose", "Spiritual Guidance"]
  },
  {
    name: "Dr. Sunita Patel",
    expertise: "Numerology & Astrology",
    category: "Numerology",
    gender: "Female",
    experience: 10,
    languages: ["Hindi", "English", "Gujarati"],
    rating: 4.5,
    reviews: 650,
    pricePerMin: 18,
    verified: true,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    description: "Expert in numerology and astrology combination. Helps with name corrections, business names, and life path guidance.",
    availability: {
      chat: true,
      call: true,
      video: true
    },
    online: true,
    specialties: ["Name Numerology", "Business Names", "Life Path Numbers", "Compatibility Analysis"]
  }
];

async function setupAstrologers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if astrologers already exist
    const existingCount = await Astrologer.countDocuments();
    console.log(`📊 Found ${existingCount} existing astrologers`);

    if (existingCount === 0) {
      // Insert sample astrologers
      console.log("📝 Inserting sample astrologers...");
      await Astrologer.insertMany(sampleAstrologers);
      console.log("✅ Sample astrologers inserted successfully");
    } else {
      // Update existing astrologers to be online
      console.log("🔄 Updating existing astrologers to be online...");
      const result = await Astrologer.updateMany(
        {},
        { 
          online: true,
          'availability.chat': true,
          'availability.call': true,
          'availability.video': true
        }
      );
      console.log(`✅ Updated ${result.modifiedCount} astrologers to be online`);
    }

    // Verify the setup
    const onlineCount = await Astrologer.countDocuments({ online: true });
    console.log(`🎉 Setup complete! ${onlineCount} astrologers are now online and available`);

  } catch (error) {
    console.error("❌ Error setting up astrologers:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the setup
setupAstrologers();
