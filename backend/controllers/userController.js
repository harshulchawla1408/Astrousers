import User from "../models/user.js";

/*
================================================
SYNC USER FROM CLERK (LOGIN / REGISTER TIME)
================================================
- Called WITHOUT auth
- Creates user if not exists
- Updates profile if exists
*/
export const syncUser = async (req, res) => {
  try {
    const { clerkId, email, name, avatar } = req.body;

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: "Clerk ID missing"
      });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      // Check if user exists with same email (e.g., created by admin)
      // This handles the case where admin creates astrologer with email,
      // then user logs in via Clerk with same email
      if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          // Update existing user's clerkId to the new Clerk ID
          // This merges the accounts - preserves role (ASTROLOGER/ADMIN) and wallet
          existingUser.clerkId = clerkId;
          existingUser.name = name || existingUser.name;
          existingUser.avatar = avatar || existingUser.avatar;
          existingUser.lastSeen = new Date();
          await existingUser.save();
          user = existingUser;
        } else {
          // No existing user, create new one
          user = await User.create({
            clerkId,
            email,
            name,
            avatar,
            role: "USER",
            walletBalance: 0,
            walletTransactions: []
          });
        }
      } else {
        // No email provided, create new user
        user = await User.create({
          clerkId,
          email,
          name,
          avatar,
          role: "USER",
          walletBalance: 0,
          walletTransactions: []
        });
      }
    } else {
      // User exists with this clerkId, update basic profile if changed
      user.email = email || user.email;
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;
      user.lastSeen = new Date();
      await user.save();
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        avatar: user.avatar,
        walletBalance: user.walletBalance
      }
    });
  } catch (err) {
    console.error("syncUser error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to sync user"
    });
  }
};

/*
================================================
GET CURRENT LOGGED IN USER (AUTH REQUIRED)
================================================
- Used by dashboard / context
- req.userId comes from clerkAuth middleware
*/
export const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        walletBalance: user.walletBalance,
        walletTransactions: user.walletTransactions?.slice(-20).reverse()
      }
    });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch user profile"
    });
  }
};
