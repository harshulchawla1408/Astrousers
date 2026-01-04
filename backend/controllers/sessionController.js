import Session from "../models/sessionModel.js";
import User from "../models/user.js";
import Astrologer from "../models/astrologerModel.js";
import { getIO } from "../socket/socketServer.js";

/*
====================================================
CREATE SESSION (USER)
====================================================
*/
export const createSession = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const { astrologerId, mode } = req.body;

    if (!astrologerId || !mode) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    if (!["chat", "call", "video"].includes(mode)) {
      return res.status(400).json({ success: false, message: "Invalid mode" });
    }

    const astrologer = await Astrologer.findById(astrologerId);
    if (!astrologer || !astrologer.isOnline) {
      return res.status(400).json({ success: false, message: "Astrologer offline" });
    }

    const price = astrologer.pricePerMinute?.[mode] || 0;
    if (user.walletBalance < price) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    // Check for existing sessions and end any pending ones before creating a new session
    const existing = await Session.findOne({
      userId: user._id,
      astrologerId,
      status: { $in: ["pending", "active"] }
    });

    if (existing) {
      // If there's an active session, return error (user should end it first)
      if (existing.status === "active") {
        return res.status(400).json({ 
          success: false, 
          message: "An active session is already in progress. Please end it before starting a new one.",
          existingSessionId: existing._id
        });
      }
      
      // If it's a pending session, automatically end it and create a new one
      if (existing.status === "pending") {
        existing.status = "ended";
        existing.endTime = new Date();
        await existing.save();
        console.log("✅ Ended existing pending session:", existing._id, "before creating new one");
      }
    }

    const session = await Session.create({
      userId: user._id,
      astrologerId,
      sessionType: mode,
      status: "pending",
      channelName: `session_${Date.now()}`
    });

    // notify astrologer
    const io = getIO();
    // Refresh astrologer to get latest socketId
    const updatedAstrologer = await Astrologer.findById(astrologerId);
    if (updatedAstrologer && updatedAstrologer.socketId) {
      console.log("📤 Emitting session:incoming to astrologer:", updatedAstrologer.socketId, "mode:", mode);
      io.to(updatedAstrologer.socketId).emit("session:incoming", {
        sessionId: session._id,
        astrologerId: updatedAstrologer._id.toString(),
        userId: user._id.toString(),
        userName: user.name,
        userAvatar: user.avatar,
        mode,
        user: { name: user.name, avatar: user.avatar } // Keep for backward compatibility
      });
    } else {
      console.log("⚠️ Astrologer socketId not found. socketId:", updatedAstrologer?.socketId, "isOnline:", updatedAstrologer?.isOnline);
    }

    return res.status(201).json({ success: true, session });
  } catch (err) {
    console.error("createSession error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create session" 
    });
  }
};

/*
====================================================
ACCEPT SESSION (ASTROLOGER)
====================================================
*/
export const acceptSession = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const astrologer = await Astrologer.findOne({ userId: user._id });
    if (!astrologer) return res.status(403).json({ success: false });

    const { sessionId } = req.body;
    const session = await Session.findById(sessionId);
    if (!session || session.astrologerId.toString() !== astrologer._id.toString()) {
      return res.status(403).json({ success: false });
    }

    session.status = "active";
    session.activeAt = new Date();
    await session.save();

    const io = getIO();
    io.to(`user:${session.userId}`).emit("session:accepted", {
      sessionId,
      channelName: session.channelName
    });

    res.json({ 
      success: true,
      message: "Session accepted",
      data: { sessionId, channelName: session.channelName }
    });
  } catch (err) {
    console.error("acceptSession error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to accept session"
    });
  }
};

/*
====================================================
REJECT SESSION (ASTROLOGER)
====================================================
*/
export const rejectSession = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const astrologer = await Astrologer.findOne({ userId: user._id });
    if (!astrologer) {
      return res.status(403).json({ success: false, message: "Not authorized as astrologer" });
    }

    const { sessionId } = req.body;
    const session = await Session.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    
    if (session.astrologerId.toString() !== astrologer._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to reject this session" });
    }

    // Update session status to rejected or delete if pending
    if (session.status === "pending") {
      session.status = "rejected";
      await session.save();
    }

    const io = getIO();
    io.to(`user:${session.userId}`).emit("session:rejected", {
      sessionId
    });

    res.json({ 
      success: true,
      message: "Session rejected"
    });
  } catch (err) {
    console.error("rejectSession error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to reject session"
    });
  }
};

/*
====================================================
END SESSION (BILLING)
====================================================
*/
export const endSession = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ 
        success: false,
        message: "Session not found"
      });
    }
    
    if (session.status !== "active") {
      return res.status(400).json({ 
        success: false,
        message: "Session is not active"
      });
    }
    
    // Verify user is either the client or the astrologer
    const isClient = session.userId.toString() === user._id.toString();
    const astrologer = await Astrologer.findById(session.astrologerId);
    const isAstrologer = astrologer && astrologer.userId.toString() === user._id.toString();
    
    if (!isClient && !isAstrologer) {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized to end this session"
      });
    }

    const client = await User.findById(session.userId);

    const durationMin = Math.max(
      1,
      Math.ceil((Date.now() - session.activeAt) / 60000)
    );

    const rate = astrologer.pricePerMinute[session.sessionType];
    const amount = durationMin * rate;

    // deduct user
    client.walletBalance -= amount;
    client.walletTransactions.push({
      type: "DEBIT",
      amount,
      reason: "Consultation",
      balanceAfter: client.walletBalance
    });

    // credit astrologer
    astrologer.totalEarnings += amount;
    astrologer.earnings.push({
      amount,
      source: session.sessionType.toUpperCase(),
      userId: client._id
    });

    session.status = "ended";
    session.durationMinutes = durationMin;
    session.coinsUsed = amount;
    session.endTime = new Date();
    session.endedBy = isClient ? "USER" : "ASTROLOGER";

    await Promise.all([client.save(), astrologer.save(), session.save()]);

    const io = getIO();
    io.to(`user:${client._id}`).emit("session:ended", { amount });
    if (astrologer.socketId) {
      io.to(astrologer.socketId).emit("session:ended", { amount });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
/*
====================================================
GET ASTROLOGER SESSIONS (DASHBOARD)
====================================================
*/
export const getAstrologerSessions = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Logged-in user must be astrologer
    const astrologer = await Astrologer.findOne({ userId: user._id });
    if (!astrologer) {
      return res.status(403).json({
        success: false,
        message: "Not authorized as astrologer"
      });
    }

    const sessions = await Session.find({
      astrologerId: astrologer._id
    })
      .populate("userId", "name email avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: sessions
    });
  } catch (err) {
    console.error("getAstrologerSessions error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch astrologer sessions"
    });
  }
};
/*
====================================================
GET SINGLE SESSION (USER / ASTROLOGER)
====================================================
*/
export const getSession = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId)
      .populate("userId", "name email avatar")
      .populate("astrologerId", "name expertise image");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    // Authorization: user OR astrologer can access
    if (
      session.userId._id.toString() !== user._id.toString() &&
      session.astrologerId.userId?.toString() !== user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    res.json({ success: true, data: session });
  } catch (err) {
    console.error("getSession error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch session"
    });
  }
};

/*
====================================================
GET USER SESSIONS (USER DASHBOARD)
====================================================
*/
export const getUserSessions = async (req, res) => {
  try {
    // Get user from database using req.userId (set by requireAuth middleware)
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const sessions = await Session.find({
      userId: user._id
    })
      .populate("astrologerId", "name expertise image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: sessions
    });
  } catch (err) {
    console.error("getUserSessions error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch user sessions"
    });
  }
};
