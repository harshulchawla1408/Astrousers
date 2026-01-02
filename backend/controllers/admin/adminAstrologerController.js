import User from "../../models/user.js";
import Astrologer from "../../models/astrologerModel.js";

/*
========================================
CREATE ASTROLOGER (ADMIN)
========================================
*/
export const createAstrologerByAdmin = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const adminUser = await User.findOne({ clerkId: req.userId });
    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const {
      name,
      email,
      expertise,
      category,
      gender,
      experience,
      languages,
      pricePerMinute
    } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // 1️⃣ Create User
    const user = await User.create({
      clerkId: `admin_${Date.now()}_${email}`,
      name,
      email,
      role: "ASTROLOGER",
      walletBalance: 0
    });

    // 2️⃣ Create Astrologer profile
    // Handle pricePerMinute - can be object or single value
    const priceStructure = typeof pricePerMinute === 'object' 
      ? pricePerMinute 
      : { chat: pricePerMinute, call: pricePerMinute, video: pricePerMinute };

    const astrologer = await Astrologer.create({
      userId: user._id,
      expertise: Array.isArray(expertise) ? expertise : [expertise].filter(Boolean),
      category,
      gender,
      experience,
      languages: Array.isArray(languages) ? languages : [languages].filter(Boolean),
      pricePerMinute: priceStructure,
      isOnline: false
    });

    res.status(201).json({ success: true, astrologer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/*
========================================
GET ALL ASTROLOGERS (ADMIN)
========================================
*/
export const getAllAstrologersAdmin = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const adminUser = await User.findOne({ clerkId: req.userId });
    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const astrologers = await Astrologer.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: astrologers });
  } catch {
    res.status(500).json({ success: false });
  }
};

/*
========================================
UPDATE ASTROLOGER (ADMIN)
========================================
*/
export const updateAstrologerAdmin = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const adminUser = await User.findOne({ clerkId: req.userId });
    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const astrologer = await Astrologer.findById(req.params.id);
    if (!astrologer) {
      return res.status(404).json({ success: false, message: "Astrologer not found" });
    }

    // Update user info if provided
    if (req.body.name || req.body.email) {
      await User.findByIdAndUpdate(astrologer.userId, {
        ...(req.body.name && { name: req.body.name }),
        ...(req.body.email && { email: req.body.email })
      });
    }

    // Remove name and email from body before updating astrologer
    const { name, email, ...astrologerData } = req.body;

    // Handle pricePerMinute structure
    if (astrologerData.pricePerMinute) {
      astrologerData.pricePerMinute = typeof astrologerData.pricePerMinute === 'object' 
        ? astrologerData.pricePerMinute 
        : { chat: astrologerData.pricePerMinute, call: astrologerData.pricePerMinute, video: astrologerData.pricePerMinute };
    }

    // Handle arrays
    if (astrologerData.expertise && !Array.isArray(astrologerData.expertise)) {
      astrologerData.expertise = [astrologerData.expertise].filter(Boolean);
    }
    if (astrologerData.languages && !Array.isArray(astrologerData.languages)) {
      astrologerData.languages = [astrologerData.languages].filter(Boolean);
    }

    const updatedAstrologer = await Astrologer.findByIdAndUpdate(
      req.params.id,
      astrologerData,
      { new: true }
    ).populate("userId", "name email");

    res.json({ success: true, astrologer: updatedAstrologer });
  } catch (err) {
    console.error("Update astrologer error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/*
========================================
DISABLE ASTROLOGER (ADMIN)
========================================
*/
export const disableAstrologer = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const adminUser = await User.findOne({ clerkId: req.userId });
    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const astrologer = await Astrologer.findById(req.params.id);
    if (!astrologer) return res.status(404).json({ success: false });

    astrologer.isOnline = false;
    astrologer.disabled = true;
    await astrologer.save();

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};
