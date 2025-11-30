import Session from "../models/sessionModel.js";
import User from "../models/user.js";
import Astrologer from "../models/astrologerModel.js";
import { getIO } from "../socket/socketServer.js";

// Create a new session (user starts consultation)
export const createSession = async (req, res) => {
  try {
    const { userId, astrologerId, mode } = req.body;

    // Validate input
    if (!userId || !astrologerId || !mode) {
      return res.status(400).json({
        success: false,
        message: "userId, astrologerId, and mode are required"
      });
    }

    if (!['chat', 'audio', 'video'].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "mode must be 'chat', 'audio', or 'video'"
      });
    }

    // Get user and astrologer
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Find astrologer by _id (MongoDB ObjectId) or clerkId
    let astrologer = await Astrologer.findById(astrologerId);
    if (!astrologer) {
      astrologer = await Astrologer.findOne({ clerkId: astrologerId });
    }
    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: "Astrologer not found"
      });
    }

    // Validate astrologer is online
    if (!astrologer.online) {
      return res.status(400).json({
        success: false,
        message: "Astrologer is currently offline"
      });
    }

    // Validate availability for the requested mode
    const modeKey = mode === 'audio' ? 'call' : mode;
    if (!astrologer.availability[modeKey]) {
      return res.status(400).json({
        success: false,
        message: `Astrologer does not offer ${mode} consultations`
      });
    }

    // Check user wallet (minimum 1 minute required)
    if (user.wallet < astrologer.pricePerMin) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance",
        required: astrologer.pricePerMin,
        current: user.wallet
      });
    }

    // Check for existing active/pending session
    const existingSession = await Session.findOne({
      userId,
      astrologerId: astrologer._id.toString(),
      status: { $in: ['pending', 'active'] }
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: "You already have an active or pending session with this astrologer",
        sessionId: existingSession._id
      });
    }

    // Generate unique channel name
    const channelName = `session_${userId}_${astrologer._id}_${Date.now()}`;

    // Create session
    const session = new Session({
      userId,
      astrologerId: astrologer._id.toString(),
      sessionType: mode,
      channelName,
      status: 'pending',
      startTime: new Date()
    });

    await session.save();

    // Emit incoming request to astrologer via socket
    const io = getIO();
    if (io) {
      // Find astrologer's socket (if they have a User record with clerkId)
      if (astrologer.clerkId) {
        const astrologerUser = await User.findOne({ clerkId: astrologer.clerkId });
        if (astrologerUser && astrologerUser.socketId) {
          io.to(astrologerUser.socketId).emit('incoming_request', {
            sessionId: session._id.toString(),
            userId,
            userName: user.name || user.firstName || 'User',
            mode,
            channelName,
            astrologerId: astrologer._id.toString()
          });
        }
      }
      // Also broadcast to astrologers room
      io.to('astrologers').emit('incoming_request', {
        sessionId: session._id.toString(),
        userId,
        userName: user.name || user.firstName || 'User',
        mode,
        channelName,
        astrologerId: astrologer._id.toString()
      });
    }

    res.status(201).json({
      success: true,
      session: {
        _id: session._id,
        userId: session.userId,
        astrologerId: session.astrologerId,
        sessionType: session.sessionType,
        channelName: session.channelName,
        status: session.status,
        startTime: session.startTime
      },
      message: "Session request sent to astrologer"
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create session",
      error: error.message
    });
  }
};

// Astrologer accepts session
export const acceptSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const astrologerClerkId = req.userId || req.body.astrologerClerkId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required"
      });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    // Verify astrologer
    const astrologer = await Astrologer.findById(session.astrologerId);
    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: "Astrologer not found"
      });
    }

    // Check if astrologer matches (by clerkId if available)
    if (astrologer.clerkId && astrologer.clerkId !== astrologerClerkId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only the assigned astrologer can accept this session"
      });
    }

    if (session.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Session is already ${session.status}`
      });
    }

    // Update session
    session.status = 'active';
    session.acceptedAt = new Date();
    session.acceptedBy = astrologer.clerkId || astrologer._id.toString();
    await session.save();

    // Update astrologer online status if needed
    await Astrologer.findByIdAndUpdate(session.astrologerId, {
      online: true
    });

    // Notify user via socket
    const io = getIO();
    if (io) {
      io.to(`user:${session.userId}`).emit('session:accepted', {
        sessionId: session._id.toString(),
        channelName: session.channelName,
        sessionType: session.sessionType,
        astrologerId: session.astrologerId
      });
    }

    res.json({
      success: true,
      session,
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
};

// Astrologer rejects session
export const rejectSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const astrologerClerkId = req.userId || req.body.astrologerClerkId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required"
      });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    // Verify astrologer
    const astrologer = await Astrologer.findById(session.astrologerId);
    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: "Astrologer not found"
      });
    }

    // Check if astrologer matches
    if (astrologer.clerkId && astrologer.clerkId !== astrologerClerkId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (session.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Session is already ${session.status}`
      });
    }

    // Update session
    session.status = 'ended';
    session.endTime = new Date();
    await session.save();

    // Notify user via socket
    const io = getIO();
    if (io) {
      io.to(`user:${session.userId}`).emit('session:rejected', {
        sessionId: session._id.toString(),
        message: "Astrologer declined your consultation request"
      });
    }

    res.json({
      success: true,
      message: "Session rejected"
    });
  } catch (error) {
    console.error("Error rejecting session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject session",
      error: error.message
    });
  }
};

// End session (user or astrologer can end)
export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.userId || req.body.userId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required"
      });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    // Verify user is part of this session
    const astrologer = await Astrologer.findById(session.astrologerId);
    const isUser = session.userId === userId;
    const isAstrologer = astrologer && astrologer.clerkId === userId;

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

    // Calculate duration and coins
    const endTime = new Date();
    const durationSeconds = Math.floor((endTime - session.startTime) / 1000);
    const durationMinutes = Math.ceil(durationSeconds / 60);

    // Free trial: first 3 minutes free for chat only
    let coinsUsed = 0;
    if (session.sessionType === 'chat' && durationMinutes <= 3) {
      coinsUsed = 0; // Free trial
    } else {
      const billableMinutes = session.sessionType === 'chat' 
        ? Math.max(0, durationMinutes - 3) // After 3 min free trial
        : durationMinutes; // No free trial for calls
      
      coinsUsed = billableMinutes * astrologer.pricePerMin;
    }

    // Deduct coins from user wallet
    const user = await User.findOne({ clerkId: session.userId });
    if (user && coinsUsed > 0) {
      if (user.wallet < coinsUsed) {
        // Insufficient balance - end session anyway
        coinsUsed = user.wallet;
        user.wallet = 0;
      } else {
        user.wallet -= coinsUsed;
      }

      // Add transaction record
      user.transactions.push({
        type: 'debit',
        amount: coinsUsed,
        description: `Consultation with ${astrologer.name} (${session.sessionType}, ${durationMinutes} min)`
      });

      await user.save();
    }

    // Update session
    session.status = 'ended';
    session.endTime = endTime;
    session.duration = durationSeconds;
    session.coinsUsed = coinsUsed;
    await session.save();

    // Notify both parties via socket
    const io = getIO();
    if (io) {
      io.to(`user:${session.userId}`).emit('session:ended', {
        sessionId: session._id.toString(),
        duration: durationSeconds,
        coinsUsed
      });

      if (astrologer && astrologer.clerkId) {
        const astrologerUser = await User.findOne({ clerkId: astrologer.clerkId });
        if (astrologerUser && astrologerUser.socketId) {
          io.to(astrologerUser.socketId).emit('session:ended', {
            sessionId: session._id.toString(),
            duration: durationSeconds,
            coinsUsed
          });
        }
      }
    }

    res.json({
      success: true,
      session: {
        _id: session._id,
        status: session.status,
        duration: session.duration,
        coinsUsed: session.coinsUsed,
        endTime: session.endTime
      },
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
};

// Get session by ID
export const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch session",
      error: error.message
    });
  }
};

// Get user's sessions
export const getUserSessions = async (req, res) => {
  try {
    const userId = req.userId || req.query.userId;
    const sessions = await Session.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
      error: error.message
    });
  }
};

// Get astrologer's sessions
export const getAstrologerSessions = async (req, res) => {
  try {
    const astrologerId = req.params.astrologerId || req.query.astrologerId;
    const sessions = await Session.find({ astrologerId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error("Error fetching astrologer sessions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
      error: error.message
    });
  }
};

