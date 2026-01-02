import User from "../../models/user.js";
import Astrologer from "../../models/astrologerModel.js";
import Session from "../../models/sessionModel.js";

export const getAdminDashboardStats = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const adminUser = await User.findOne({ clerkId: req.userId });
    if (!adminUser || adminUser.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const [
      totalUsers,
      totalAstrologers,
      onlineAstrologers,
      activeSessions,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments({ role: "USER" }),
      Astrologer.countDocuments(),
      Astrologer.countDocuments({ isOnline: true }),
      Session.countDocuments({ status: "active" }),
      Astrologer.aggregate([
        { $group: { _id: null, sum: { $sum: "$totalEarnings" } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAstrologers,
        onlineAstrologers,
        activeSessions,
        totalRevenue: totalRevenue[0]?.sum || 0
      }
    });
  } catch {
    res.status(500).json({ success: false });
  }
};
