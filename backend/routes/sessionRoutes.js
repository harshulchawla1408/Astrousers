import express from "express";
import mongoose from "mongoose";
import User from "../models/user.js";
import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

// Session schema
const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  astrologerId: { type: String, required: true },
  sessionType: { type: String, enum: ['chat', 'audio', 'video'], required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number, default: 0 }, // in seconds
  coinsUsed: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'ended'], default: 'active' },
  channelName: { type: String, required: true }
});

const Session = mongoose.model('Session', sessionSchema);

// Start a new session with coin validation
router.post("/start", requireAuth, async (req, res) => {
  try {
    const { astrologerId, sessionType, channelName, ratePerMinute } = req.body;
    
    if (!astrologerId || !sessionType || !channelName || !ratePerMinute) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Check user balance
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Check if user has enough wallet for at least 1 minute
    if (user.wallet < ratePerMinute) {
      return res.status(400).json({ 
        success: false,
        message: "Insufficient balance",
        requiredCoins: ratePerMinute,
        currentBalance: user.wallet
      });
    }

    // Check if there's already an active session
    const existingSession = await Session.findOne({
      userId: req.userId,
      astrologerId,
      status: 'active'
    });

    if (existingSession) {
      return res.status(400).json({ 
        success: false,
        message: "You already have an active session with this astrologer" 
      });
    }

    const session = new Session({
      userId: req.userId,
      astrologerId,
      sessionType,
      channelName,
      startTime: new Date()
    });

    await session.save();

    res.json({ 
      success: true,
      session: session,
      currentBalance: user.wallet,
      message: "Session started successfully"
    });
  } catch (error) {
    console.error("Error starting session:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to start session",
      error: error.message
    });
  }
});

// End a session and deduct coins
router.post("/end", requireAuth, async (req, res) => {
  try {
    const { sessionId, duration, ratePerMinute } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ 
        success: false,
        message: "Session ID is required" 
      });
    }

    const session = await Session.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ 
        success: false,
        message: "Session not found" 
      });
    }

    // Verify session belongs to user
    if (session.userId !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized access to session" 
      });
    }

    if (session.status === 'ended') {
      return res.status(400).json({ 
        success: false,
        message: "Session already ended" 
      });
    }

    const endTime = new Date();
    const actualDuration = Math.floor((endTime - session.startTime) / 1000);
    const finalDuration = duration || actualDuration;

    // Calculate coins to deduct
    const coinsToDeduct = Math.ceil((finalDuration / 60) * ratePerMinute);

    // Get user and deduct coins
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Check if user has enough coins
    if (user.wallet < coinsToDeduct) {
      return res.status(400).json({ 
        success: false,
        message: "Insufficient balance to complete session",
        requiredCoins: coinsToDeduct,
        currentBalance: user.wallet
      });
    }

    // Deduct coins and add transaction
    user.wallet -= coinsToDeduct;
    user.transactions.push({
      type: "debit",
      amount: coinsToDeduct,
      description: `${session.sessionType} session with astrologer ${session.astrologerId}`,
    });

    await user.save();

    // Update session
    session.endTime = endTime;
    session.duration = finalDuration;
    session.coinsUsed = coinsToDeduct;
    session.status = 'ended';

    await session.save();

    res.json({ 
      success: true,
      session: session,
      coinsUsed: coinsToDeduct,
      remainingBalance: user.wallet,
      message: "Session ended successfully"
    });
  } catch (error) {
    console.error("Error ending session:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to end session",
      error: error.message
    });
  }
});

// Get active sessions for authenticated user
router.get("/active", requireAuth, async (req, res) => {
  try {
    const activeSessions = await Session.find({
      userId: req.userId,
      status: 'active'
    }).populate('astrologerId', 'name expertise');

    res.json({ 
      success: true,
      sessions: activeSessions 
    });
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch active sessions",
      error: error.message
    });
  }
});

// Get session history for authenticated user
router.get("/history", requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const sessions = await Session.find({
      userId: req.userId,
      status: 'ended'
    })
    .populate('astrologerId', 'name expertise')
    .sort({ endTime: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Session.countDocuments({
      userId: req.userId,
      status: 'ended'
    });

    res.json({ 
      success: true,
      sessions: sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error("Error fetching session history:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch session history",
      error: error.message
    });
  }
});

export default router;
