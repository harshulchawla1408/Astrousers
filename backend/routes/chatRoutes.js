import express from "express";
import { requireAuth } from "../middleware/clerkAuth.js";
import Message from "../models/messageModel.js";
import Session from "../models/sessionModel.js";
import User from "../models/user.js";
import Astrologer from "../models/astrologerModel.js";

const router = express.Router();

/*
GET CHAT MESSAGES (SESSION BASED)
*/
router.get("/:sessionId", requireAuth, async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // authorization
    const isUser = session.userId.toString() === user._id.toString();
    const astrologer = await Astrologer.findById(session.astrologerId);
    const isAstro = astrologer && astrologer.userId.toString() === user._id.toString();

    if (!isUser && !isAstro) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const messages = await Message.find({ sessionId }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;
