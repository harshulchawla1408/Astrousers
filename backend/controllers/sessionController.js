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
    const user = req.user; // injected by auth middleware
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

    const existing = await Session.findOne({
      userId: user._id,
      astrologerId,
      status: { $in: ["pending", "active"] }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "Session already exists" });
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
    if (astrologer.socketId) {
      io.to(astrologer.socketId).emit("session:incoming", {
        sessionId: session._id,
        user: { name: user.name, avatar: user.avatar },
        mode
      });
    }

    return res.status(201).json({ success: true, session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Create session failed" });
  }
};

/*
====================================================
ACCEPT SESSION (ASTROLOGER)
====================================================
*/
export const acceptSession = async (req, res) => {
  try {
    const user = req.user;
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

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/*
====================================================
END SESSION (BILLING)
====================================================
*/
export const endSession = async (req, res) => {
  try {
    const user = req.user;
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session || session.status !== "active") {
      return res.status(400).json({ success: false });
    }

    const astrologer = await Astrologer.findById(session.astrologerId);
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
    session.duration = durationMin;
    session.coinsUsed = amount;

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
    const user = req.user;

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
      sessions
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
    const user = req.user;
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

    res.json({ success: true, session });
  } catch (err) {
    console.error("getSession error:", err);
    res.status(500).json({ success: false });
  }
};

/*
====================================================
GET USER SESSIONS (USER DASHBOARD)
====================================================
*/
export const getUserSessions = async (req, res) => {
  try {
    const user = req.user;

    const sessions = await Session.find({
      userId: user._id
    })
      .populate("astrologerId", "name expertise image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      sessions
    });
  } catch (err) {
    console.error("getUserSessions error:", err);
    res.status(500).json({ success: false });
  }
};
