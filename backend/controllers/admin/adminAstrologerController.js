import User from "../../models/user.js";
import Astrologer from "../../models/astrologerModel.js";

/*
========================================
CREATE ASTROLOGER (ADMIN)
========================================
Converts existing USER to ASTROLOGER
Admin selects existing user and adds astrologer details
*/
export const createAstrologerByAdmin = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const adminUser = await User.findOne({ clerkId: req.userId });
    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const {
      userId, // Existing user ID to convert
      expertise,
      category,
      gender,
      experience,
      languages,
      pricePerMinute,
      bio
    } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // 1️⃣ Find existing user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2️⃣ Check if user is already an astrologer
    const existingAstrologer = await Astrologer.findOne({ userId: user._id });
    if (existingAstrologer) {
      return res.status(400).json({ 
        success: false, 
        message: "User is already an astrologer" 
      });
    }

    // 3️⃣ Update user role from USER to ASTROLOGER
    user.role = "ASTROLOGER";
    await user.save();

    // 4️⃣ Create Astrologer profile
    // Handle pricePerMinute - can be object or single value
    const priceStructure = typeof pricePerMinute === 'object' 
      ? pricePerMinute 
      : { chat: pricePerMinute, call: pricePerMinute, video: pricePerMinute };

    const astrologer = await Astrologer.create({
      userId: user._id,
      expertise: Array.isArray(expertise) ? expertise : [expertise].filter(Boolean),
      category,
      gender,
      experience: Number(experience) || 0,
      languages: Array.isArray(languages) ? languages : [languages].filter(Boolean),
      pricePerMinute: priceStructure,
      bio: bio || "",
      isOnline: false
    });

    res.status(201).json({ 
      success: true, 
      message: "User converted to astrologer successfully",
      data: astrologer 
    });
  } catch (err) {
    console.error("createAstrologerByAdmin error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to create astrologer"
    });
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
  } catch (err) {
    console.error("getAllAstrologersAdmin error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch astrologers"
    });
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

    res.json({ 
      success: true, 
      message: "Astrologer updated successfully",
      data: updatedAstrologer 
    });
  } catch (err) {
    console.error("Update astrologer error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update astrologer"
    });
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

    res.json({ 
      success: true,
      message: "Astrologer disabled successfully"
    });
  } catch (err) {
    console.error("disableAstrologer error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to disable astrologer"
    });
  }
};

/*
========================================
GET ALL USERS (ADMIN) - For astrologer conversion
========================================
Returns all users with role "USER" for admin to select
*/
export const getAllUsersForConversion = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const adminUser = await User.findOne({ clerkId: req.userId });
    
    if (!adminUser) {
      console.error("Admin user not found for clerkId:", req.userId);
      return res.status(404).json({ 
        success: false, 
        message: "Admin user not found. Please ensure you are logged in." 
      });
    }
    
    if (adminUser.role !== "ADMIN") {
      console.error("User is not admin. Role:", adminUser.role, "clerkId:", req.userId);
      return res.status(403).json({ 
        success: false, 
        message: `Admin access required. Your role is: ${adminUser.role}` 
      });
    }

    // Get all users with role USER (not already astrologers)
    const users = await User.find({ role: "USER" })
      .select("_id name email avatar clerkId createdAt")
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${users.length} users with role USER`);

    // Filter out users who already have astrologer profiles
    const userIds = users.map(u => u._id);
    const existingAstrologers = await Astrologer.find({ userId: { $in: userIds } })
      .select("userId")
      .lean();
    
    const astrologerUserIds = new Set(existingAstrologers.map(a => a.userId.toString()));
    const availableUsers = users.filter(u => !astrologerUserIds.has(u._id.toString()));

    console.log(`Found ${availableUsers.length} users available for conversion (${users.length - availableUsers.length} already astrologers)`);

    res.json({ 
      success: true, 
      data: availableUsers,
      total: availableUsers.length
    });
  } catch (err) {
    console.error("getAllUsersForConversion error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch users",
      error: err.message
    });
  }
};
