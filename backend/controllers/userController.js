import mongoose from "mongoose";
import User from "../models/user.js";

// Create or update user (primary function for POST /api/v1/user)
export const createOrUpdateUser = async (req, res) => {
  try {
    console.log('📥 createOrUpdateUser: Request received');
    console.log('📥 createOrUpdateUser: Request body:', JSON.stringify(req.body, null, 2));

    // Extract fields from request body
    const { clerkId, firstName, lastName, fullName, email, profileImage } = req.body || {};

    // Validate clerkId (required)
    if (!clerkId || typeof clerkId !== "string" || clerkId.trim() === "") {
      console.error("❌ createOrUpdateUser: Missing or invalid clerkId");
      return res.status(400).json({ 
        success: false, 
        message: "clerkId is required and must be a non-empty string",
        error: "INVALID_CLERK_ID"
      });
    }

    // Convert names cleanly
    const finalFirstName = (firstName || "").trim();
    const finalLastName = (lastName || "").trim();
    const finalFullName = (fullName || `${finalFirstName} ${finalLastName}`).trim();

    console.log('📥 createOrUpdateUser: Processed names:', {
      firstName: finalFirstName,
      lastName: finalLastName,
      fullName: finalFullName
    });

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ createOrUpdateUser: MongoDB not connected! ReadyState:', mongoose.connection.readyState);
      return res.status(503).json({ 
        success: false, 
        message: "Database connection not available",
        error: "DATABASE_NOT_CONNECTED"
      });
    }

    // Check if user already exists
    let user = await User.findOne({ clerkId: clerkId.trim() });

    if (user) {
      // Update existing user - only update provided fields
      console.log(`✅ User exists, updating: ${clerkId}`);
      
      const updateData = {
        lastSeen: new Date()
      };

      // Only update fields if they exist in req.body
      if (firstName !== undefined) updateData.firstName = finalFirstName;
      if (lastName !== undefined) updateData.lastName = finalLastName;
      if (fullName !== undefined || firstName !== undefined || lastName !== undefined) {
        updateData.name = finalFullName;
      }
      if (email !== undefined && email !== null) updateData.email = String(email).trim() || "";
      if (profileImage !== undefined && profileImage !== null) updateData.profileImage = String(profileImage).trim() || "";

      // Update user
      Object.assign(user, updateData);
      await user.save();

      console.log(`✅ User updated successfully: ${clerkId}`);
      return res.status(200).json({ 
        success: true, 
        user: {
          clerkId: user.clerkId,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          name: user.name || "",
          email: user.email || "",
          profileImage: user.profileImage || "",
          wallet: user.wallet,
          role: user.role,
          isOnline: user.isOnline,
          lastSeen: user.lastSeen
        },
        message: "User updated successfully"
      });
    }

    // Create new user with only required and default fields
    console.log(`📝 Creating new user: ${clerkId}`);
    const newUserData = {
      clerkId: clerkId.trim(),
      firstName: finalFirstName,
      lastName: finalLastName,
      name: finalFullName,
      email: (email !== undefined && email !== null) ? String(email).trim() : "",
      profileImage: (profileImage !== undefined && profileImage !== null) ? String(profileImage).trim() : "",
      wallet: 30, // Default wallet value
      role: "user", // Default role
      isOnline: false,
      lastSeen: new Date()
    };

    console.log('📝 createOrUpdateUser: User data to create:', JSON.stringify(newUserData, null, 2));
    
    user = await User.create(newUserData);
    
    console.log(`✅ New user created successfully: ${clerkId}`);
    console.log('✅ createOrUpdateUser: Created user details:', {
      _id: user._id,
      clerkId: user.clerkId,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      email: user.email,
      wallet: user.wallet,
      role: user.role
    });

    return res.status(201).json({ 
      success: true, 
      user: {
        clerkId: user.clerkId,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        name: user.name || "",
        email: user.email || "",
        profileImage: user.profileImage || "",
        wallet: user.wallet,
        role: user.role,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen
      },
      message: "User created successfully"
    });
  } catch (err) {
    console.error("❌ Error in createOrUpdateUser:", err);
    
    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
      console.error("❌ Duplicate clerkId detected:", err.keyValue);
      // Try to fetch and return the existing user
      try {
        const existingUser = await User.findOne({ clerkId: req.body?.clerkId });
        if (existingUser) {
          existingUser.lastSeen = new Date();
          await existingUser.save();
          return res.status(200).json({ 
            success: true, 
            user: {
              clerkId: existingUser.clerkId,
              firstName: existingUser.firstName || "",
              lastName: existingUser.lastName || "",
              name: existingUser.name || "",
              email: existingUser.email || "",
              profileImage: existingUser.profileImage || "",
              wallet: existingUser.wallet,
              role: existingUser.role
            },
            message: "User already exists, updated lastSeen"
          });
        }
      } catch (fetchErr) {
        console.error("❌ Error fetching existing user:", fetchErr);
      }
      return res.status(409).json({ 
        success: false, 
        message: "User with this clerkId already exists",
        error: "DUPLICATE_USER"
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message).join(', ');
      console.error("❌ Validation error:", errors);
      return res.status(400).json({ 
        success: false, 
        message: `Validation error: ${errors}`,
        error: "VALIDATION_ERROR",
        details: errors
      });
    }

    // Generic error
    return res.status(500).json({ 
      success: false, 
      message: err.message || "Internal server error",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
};

// Sync Clerk user into MongoDB (now points to createOrUpdateUser via routes)
// This function is kept for backward compatibility but routes now use createOrUpdateUser
// Keeping this here in case any direct references exist, but it should not be used
export const syncUser = createOrUpdateUser;

export const getUserProfile = async (req, res) => {
  try {
    const clerkId = req.userId;
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("❌ Error in getUserProfile:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateUserWallet = async (req, res) => {
  try {
    const clerkId = req.userId;
    const { amount, operation = 'increment' } = req.body;

    if (typeof amount !== 'number') {
      return res.status(400).json({ error: "Amount must be a number" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (operation === 'set') {
      user.wallet = amount;
    } else if (operation === 'increment') {
      user.wallet += amount;
    } else {
      return res.status(400).json({ error: "Invalid operation" });
    }

    await user.save();
    return res.status(200).json({ success: true, wallet: user.wallet });
  } catch (err) {
    console.error("❌ Error in updateUserWallet:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const clerkId = req.userId;
    const { name, profileImage } = req.body;
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (typeof name === 'string') user.name = name;
    if (typeof profileImage === 'string') user.profileImage = profileImage;
    await user.save();
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("❌ Error in updateUserProfile:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
