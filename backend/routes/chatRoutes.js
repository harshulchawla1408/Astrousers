import express from "express";
import { requireAuth } from "../middleware/clerkAuth.js";
import Message from "../models/messageModel.js";
import Session from "../models/sessionModel.js";

const router = express.Router();

/*
GET CHAT MESSAGES (SESSION BASED)
*/
router.get("/:sessionId", requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const user = req.user;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false });
    }

    // authorization
    if (
      session.userId.toString() !== user._id.toString() &&
      session.astrologerId.toString() !== user._id.toString()
    ) {
      return res.status(403).json({ success: false });
    }

    const messages = await Message.find({ sessionId }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;
