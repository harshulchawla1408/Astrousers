import express from "express";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

// Chat message schema
const chatMessageSchema = new mongoose.Schema({
  astrologerId: { type: String, required: true },
  userId: { type: String, required: true },
  message: { type: String, required: true },
  sender: { type: String, enum: ['user', 'astrologer'], required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// Get messages for a chat session
router.get("/messages", requireAuth, async (req, res) => {
  try {
    const { astrologerId } = req.query;
    
    if (!astrologerId) {
      return res.status(400).json({ 
        error: "Astrologer ID is required" 
      });
    }

    const currentUserId = req.userId;

    const messages = await ChatMessage.find({
      astrologerId: astrologerId,
      userId: currentUserId
    }).sort({ timestamp: 1 });

    res.json({ 
      success: true,
      messages: messages 
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ 
      error: "Failed to fetch messages" 
    });
  }
});

// Send a message
router.post("/send", requireAuth, async (req, res) => {
  try {
    const { astrologerId, message, sender = 'user' } = req.body;
    
    if (!astrologerId || !message) {
      return res.status(400).json({ 
        error: "Astrologer ID and message are required" 
      });
    }

    const currentUserId = req.userId;

    const chatMessage = new ChatMessage({
      astrologerId,
      userId: currentUserId,
      message,
      sender,
      timestamp: new Date()
    });

    await chatMessage.save();

    res.json({ 
      success: true,
      message: chatMessage 
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ 
      error: "Failed to send message" 
    });
  }
});

// Mark messages as read
router.put("/read", requireAuth, async (req, res) => {
  try {
    const { astrologerId } = req.body;
    
    if (!astrologerId || !userId) {
      return res.status(400).json({ 
        error: "Astrologer ID and User ID are required" 
      });
    }

    await ChatMessage.updateMany({
      astrologerId,
      userId: req.userId,
      sender: 'astrologer',
      isRead: false
    }, {
      isRead: true
    });

    res.json({ 
      success: true,
      message: "Messages marked as read" 
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ 
      error: "Failed to mark messages as read" 
    });
  }
});

export default router;
