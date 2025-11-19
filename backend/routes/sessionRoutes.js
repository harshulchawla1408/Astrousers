import express from "express";
import User from "../models/user.js";
import Session from "../models/sessionModel.js";
import { requireAuth } from "../middleware/clerkAuth.js";
import { getIO } from "../socket/socketServer.js";

const router = express.Router();

// Start a new session with coin validation (creates pending session)
router.post("/start", requireAuth, async (req, res) => {
  try {
    const { astrologerId, sessionType, ratePerMinute } = req.body;
    
    if (!astrologerId || !sessionType || !ratePerMinute) {
      return res.status(400).json({ 
        success: false,
        message: "astrologerId, sessionType, and ratePerMinute are required" 
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

    // Check if there's already an active or pending session
    const existingSession = await Session.findOne({
      userId: req.userId,
      astrologerId,
      status: { $in: ['active', 'pending'] }
    });

    if (existingSession) {
      return res.status(400).json({ 
        success: false,
        message: "You already have an active or pending session with this astrologer",
        sessionId: existingSession._id
      });
    }

    // Generate unique channel name
    const channelName = `session_${req.userId}_${astrologerId}_${Date.now()}`;

    const session = new Session({
      userId: req.userId,
      astrologerId,
      sessionType,
      channelName,
      status: 'pending',
      startTime: new Date()
    });

    await session.save();

    // Notify astrologer via socket
    const io = getIO();
    if (io) {
      const astrologer = await User.findOne({ clerkId: astrologerId });
      if (astrologer && astrologer.socketId) {
        io.to(astrologer.socketId).emit('session:request', {
          sessionId: session._id.toString(),
          userId: req.userId,
          userName: user.name,
          sessionType,
          channelName
        });
      }
    }

    res.json({ 
      success: true,
      session: session,
      currentBalance: user.wallet,
      message: "Session request sent. Waiting for astrologer to accept."
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

// Accept session (astrologer accepts pending session)
router.post("/accept", requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    
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

    // Verify user is the astrologer
    const user = await User.findOne({ clerkId: req.userId });
    if (!user || user.role !== 'astrologer' || user.clerkId !== session.astrologerId) {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized: Only the assigned astrologer can accept this session" 
      });
    }

    // Atomic check: ensure astrologer is not already in a session
    const updatedAstrologer = await User.findOneAndUpdate(
      { 
        clerkId: session.astrologerId,
        currentSessionId: null // Only update if not in a session
      },
      { 
        currentSessionId: session._id
      },
      { new: true }
    );

    if (!updatedAstrologer) {
      return res.status(400).json({ 
        success: false,
        message: "Astrologer is already in a session" 
      });
    }

    // Update session status
    session.status = 'active';
    session.acceptedAt = new Date();
    session.acceptedBy = req.userId;
    await session.save();

    // Notify user via socket
    const io = getIO();
    if (io) {
      io.to(`user:${session.userId}`).emit('session:accepted', {
        sessionId: session._id.toString(),
        channelName: session.channelName,
        sessionType: session.sessionType
      });
    }

    res.json({ 
      success: true,
      session: session,
      message: "Session accepted successfully"
    });
  } catch (error) {
    console.error("Error accepting session:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to accept session",
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

    // Verify session belongs to user or astrologer
    const user = await User.findOne({ clerkId: req.userId });
    const isUser = session.userId === req.userId;
    const isAstrologer = user && user.role === 'astrologer' && session.astrologerId === req.userId;
    
    if (!isUser && !isAstrologer) {
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

    // Release astrologer's currentSessionId if ending
    if (isAstrologer) {
      await User.findOneAndUpdate(
        { clerkId: req.userId },
        { currentSessionId: null }
      );
    }

    const endTime = new Date();
    const actualDuration = Math.floor((endTime - session.startTime) / 1000);
    const finalDuration = duration || actualDuration;

    // Calculate coins to deduct
    const coinsToDeduct = Math.ceil((finalDuration / 60) * ratePerMinute);

    // Get user and deduct coins
    const existingUser = await User.findOne({ clerkId: req.userId });
    if (!existingUser) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Check if user has enough coins
    if (existingUser.wallet < coinsToDeduct) {
      return res.status(400).json({ 
        success: false,
        message: "Insufficient balance to complete session",
        requiredCoins: coinsToDeduct,
        currentBalance: existingUser.wallet
      });
    }

    // Deduct coins and add transaction
    existingUser.wallet -= coinsToDeduct;
    existingUser.transactions.push({
      type: "debit",
      amount: coinsToDeduct,
      description: `${session.sessionType} session with astrologer ${session.astrologerId}`,
    });

    await existingUser.save();

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
      remainingBalance: existingUser.wallet,
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
