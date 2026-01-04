import Astrologer from "../models/astrologerModel.js";
import User from "../models/user.js";

/*
================================================
GET ALL ASTROLOGERS (FILTER + SEARCH)
================================================
*/
export const getAllAstrologers = async (req, res) => {
  try {
    const { search, category, gender, language, sortBy } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { expertise: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (language) filter.languages = { $in: [language] };

    const sort = sortBy ? { [sortBy]: -1 } : { rating: -1 };

    const astrologers = await Astrologer.find(filter)
      .populate("userId", "name avatar")
      .sort(sort)
      .lean();

    // Transform data to match frontend expectations
    const transformedAstrologers = astrologers.map(astro => ({
      ...astro,
      name: astro.userId?.name || "Unknown",
      image: astro.userId?.avatar || null,
      online: astro.isOnline || false,
      pricePerMin: astro.pricePerMinute?.chat || astro.pricePerMinute?.call || astro.pricePerMinute?.video || 0,
      expertise: Array.isArray(astro.expertise) ? astro.expertise.join(", ") : astro.expertise || "N/A",
      // Add availability - default to true for all types if not set
      availability: astro.availability || {
        chat: true,
        call: true,
        video: true
      }
    }));

    res.json({ success: true, data: transformedAstrologers });
  } catch (err) {
    console.error("getAllAstrologers error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch astrologers"
    });
  }
};

/*
================================================
GET ONLINE ASTROLOGERS (REAL ONLINE ONLY)
================================================
*/
export const getOnlineAstrologers = async (req, res) => {
  try {
    const astrologers = await Astrologer.find({ isOnline: true })
      .populate("userId", "name avatar")
      .lean();

    // Transform data to match frontend expectations
    const transformedAstrologers = astrologers.map(astro => ({
      ...astro,
      name: astro.userId?.name || "Unknown",
      image: astro.userId?.avatar || null,
      online: astro.isOnline || false,
      pricePerMin: astro.pricePerMinute?.chat || astro.pricePerMinute?.call || astro.pricePerMinute?.video || 0,
      expertise: Array.isArray(astro.expertise) ? astro.expertise.join(", ") : astro.expertise || "N/A",
      // Add availability - default to true for all types if not set
      availability: astro.availability || {
        chat: true,
        call: true,
        video: true
      }
    }));

    res.json({
      success: true,
      count: transformedAstrologers.length,
      data: transformedAstrologers
    });
  } catch (err) {
    console.error("getOnlineAstrologers error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch online astrologers"
    });
  }
};

/*
================================================
GET ASTROLOGER BY ID
================================================
*/
export const getAstrologerById = async (req, res) => {
  try {
    const astrologer = await Astrologer.findById(req.params.id)
      .populate("userId", "name avatar")
      .lean();

    if (!astrologer) {
      return res.status(404).json({ success: false });
    }

    // Transform data to match frontend expectations
    const transformedAstrologer = {
      ...astrologer,
      name: astrologer.userId?.name || "Unknown",
      image: astrologer.userId?.avatar || null,
      online: astrologer.isOnline || false,
      pricePerMin: astrologer.pricePerMinute?.chat || astrologer.pricePerMinute?.call || astrologer.pricePerMinute?.video || 0,
      expertise: Array.isArray(astrologer.expertise) ? astrologer.expertise.join(", ") : astrologer.expertise || "N/A",
      // Add availability - default to true for all types if not set
      availability: astrologer.availability || {
        chat: true,
        call: true,
        video: true
      }
    };

    res.json({ success: true, data: transformedAstrologer });
  } catch (err) {
    console.error("getAstrologerById error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch astrologer"
    });
  }
};

/*
================================================
CREATE ASTROLOGER PROFILE (FIRST TIME)
================================================
*/
export const createAstrologer = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role !== "ASTROLOGER") {
      return res.status(403).json({ success: false });
    }

    const exists = await Astrologer.findOne({ userId: user._id });
    if (exists) {
      return res.status(400).json({ success: false, message: "Already exists" });
    }

    const astrologer = await Astrologer.create({
      userId: user._id,
      ...req.body
    });

    res.status(201).json({ success: true, data: astrologer });
  } catch (err) {
    console.error("createAstrologer error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to create astrologer profile"
    });
  }
};

/*
================================================
UPDATE ASTROLOGER PROFILE
================================================
*/
export const updateAstrologer = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const astrologer = await Astrologer.findOneAndUpdate(
      { userId: user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!astrologer) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, data: astrologer });
  } catch (err) {
    console.error("updateAstrologer error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to update astrologer profile"
    });
  }
};

/*
================================================
CHECK IF USER IS ASTROLOGER (BY CLERK ID)
================================================
*/
export const checkAstrologer = async (req, res) => {
  try {
    const { clerkId } = req.params;
    
    // Find user by clerkId
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      return res.json({ exists: false });
    }

    // Find astrologer profile linked to this user
    const astrologer = await Astrologer.findOne({ userId: user._id });

    if (!astrologer) {
      return res.json({ exists: false });
    }

    res.json({ 
      exists: true, 
      astrologer: {
        _id: astrologer._id,
        userId: astrologer.userId,
        isOnline: astrologer.isOnline
      }
    });
  } catch (err) {
    console.error("checkAstrologer error:", err);
    res.status(500).json({ exists: false });
  }
};

/*
================================================
TOP ASTROLOGERS (ONLINE + RATED)
================================================
*/
export const getTopAstrologers = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 4;

    const astrologers = await Astrologer.find({ isOnline: true })
      .sort({ rating: -1, totalEarnings: -1 })
      .limit(limit)
      .populate("userId", "name avatar")
      .lean();

    // Transform data to match frontend expectations
    const transformedAstrologers = astrologers.map(astro => ({
      ...astro,
      name: astro.userId?.name || "Unknown",
      image: astro.userId?.avatar || null,
      online: astro.isOnline || false,
      pricePerMin: astro.pricePerMinute?.chat || astro.pricePerMinute?.call || astro.pricePerMinute?.video || 0,
      expertise: Array.isArray(astro.expertise) ? astro.expertise.join(", ") : astro.expertise || "N/A",
      // Add availability - default to true for all types if not set
      availability: astro.availability || {
        chat: true,
        call: true,
        video: true
      }
    }));

    res.json({ success: true, data: transformedAstrologers });
  } catch (err) {
    console.error("getTopAstrologers error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch top astrologers"
    });
  }
};
