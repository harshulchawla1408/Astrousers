import User from "../models/user.js";

// Create or update user after Clerk auth
export const upsertUser = async (req, res) => {
  try {
    const { clerkId, email, fullName, profileImage } = req.body;

    let user = await User.findOne({ clerkId });

    if (user) {
      // Update if exists
      user.email = email;
      user.fullName = fullName;
      user.profileImage = profileImage;
      await user.save();
    } else {
      // Create if not exists with default 100 coins
      user = await User.create({ 
        clerkId, 
        email, 
        fullName, 
        profileImage,
        coins: 100, // Default wallet balance
        transactions: [{
          type: 'credit',
          amount: 100,
          description: 'Welcome bonus - Account created'
        }]
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Error in upsertUser:", err);
    res.status(500).json({ error: "Server error" });
  }
};
