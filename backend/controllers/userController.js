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
      // Create if not exists
      user = await User.create({ clerkId, email, fullName, profileImage });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Error in upsertUser:", err);
    res.status(500).json({ error: "Server error" });
  }
};
