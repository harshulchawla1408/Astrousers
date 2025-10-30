import User from "../models/user.js";

// Create or update user immediately after Clerk signup or on login
export const createOrUpdateUser = async (req, res) => {
  try {
    const clerkId = req.userId; // set by middleware
    const { email, name, profileImage } = req.body || {};

    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        email: email ?? req.user?.email ?? "",
        name: name ?? req.user?.name ?? "",
        profileImage: profileImage ?? req.user?.profileImage ?? "",
        wallet: 100,
        transactions: [{
          type: 'credit',
          amount: 100,
          description: 'Welcome bonus - Account created'
        }]
      });
    } else {
      user.email = email ?? user.email;
      user.name = name ?? user.name;
      user.profileImage = profileImage ?? user.profileImage;
      await user.save();
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("❌ Error in createOrUpdateUser:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

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
