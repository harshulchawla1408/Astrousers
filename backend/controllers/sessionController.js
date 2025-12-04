// backend/controllers/sessionController.js
import mongoose from "mongoose";
import Session from "../models/sessionModel.js";
import User from "../models/user.js";
import Astrologer from "../models/astrologerModel.js";
import { getIO } from "../socket/socketServer.js";

/**
 * Helper: resolve user by either Mongo _id or clerkId (string).
 * Returns the found user document or null.
 */
const resolveUser = async (identifier) => {
  if (!identifier) return null;
  // if looks like ObjectId
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const u = await User.findById(identifier);
    if (u) return u;
  }
  // fallback to clerkId
  return await User.findOne({ clerkId: identifier });
};

/**
 * Helper: resolve astrologer by ObjectId or clerkId
 */
const resolveAstrologer = async (identifier) => {
  if (!identifier) return null;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const a = await Astrologer.findById(identifier);
    if (a) return a;
  }
  return await Astrologer.findOne({ clerkId: identifier });
};

// Create a new session (user starts consultation)
export const createSession = async (req, res) => {
  try {
    const { userId: userIdentifier, astrologerId: astrologerIdentifier, mode } = req.body;

    // Validate input
    if (!userIdentifier || !astrologerIdentifier || !mode) {
      return res.status(400).json({ success: false, message: "userId, astrologerId and mode are required" });
    }

    if (!["chat", "audio", "video"].includes(mode)) {
      return res.status(400).json({ success: false, message: "mode must be 'chat', 'audio' or 'video'" });
    }

    // Resolve user and astrologer documents
    const user = await resolveUser(userIdentifier);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const astrologer = await resolveAstrologer(astrologerIdentifier);
    if (!astrologer) return res.status(404).json({ success: false, message: "Astrologer not found" });

    // Ensure astrologer is online
    if (!astrologer.online) {
      return res.status(400).json({ success: false, message: "Astrologer is currently offline" });
    }

    // Validate availability (availability keys may be e.g. chat: true, call: true)
    const modeKey = mode === "audio" ? "call" : mode;
    if (!astrologer.availability || !astrologer.availability[modeKey]) {
      return res.status(400).json({ success: false, message: `Astrologer does not offer ${mode} consultations` });
    }

    // Check wallet for minimum one minute (or at least pricePerMin)
    const pricePerMin = Number(astrologer.pricePerMin || 0);
    if (pricePerMin <= 0) {
      return res.status(400).json({ success: false, message: "Astrologer has invalid pricePerMin configured" });
    }
    if ((user.wallet || 0) < pricePerMin) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance",
        required: pricePerMin,
        current: user.wallet || 0
      });
    }

    // Prevent duplicate active/pending session between same user & astrologer
    const existingSession = await Session.findOne({
      userId: user._id.toString(),
      astrologerId: astrologer._id.toString(),
      status: { $in: ["pending", "active"] }
    });
    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: "You already have an active or pending session with this astrologer",
        sessionId: existingSession._id
      });
    }

    // Create unique channel name for Agora / signalling
    const channelName = `session_${user._id.toString()}_${astrologer._id.toString()}_${Date.now()}`;

    // Save session (store user and astrologer by their Mongo _id strings)
    const session = new Session({
      userId: user._id.toString(),
      astrologerId: astrologer._id.toString(),
      sessionType: mode,
      channelName,
      status: "pending",
      startTime: new Date()
    });
    await session.save();

    // Emit incoming request to astrologer via socket
    const io = getIO();
    if (io) {
      // If astrologer has a socketId field directly on their doc, use it
      if (astrologer.socketId) {
        io.to(astrologer.socketId).emit("incoming_request", {
          sessionId: session._id.toString(),
          userId: user._id.toString(),
          userName: user.name || user.firstName || "User",
          mode,
          channelName,
          astrologerId: astrologer._id.toString()
        });
      }

      // Also try to notify via user-scoped room if astrologer has linked User record with socket
      if (astrologer.clerkId) {
        const linkedUser = await User.findOne({ clerkId: astrologer.clerkId });
        if (linkedUser && linkedUser.socketId) {
          io.to(linkedUser.socketId).emit("incoming_request", {
            sessionId: session._id.toString(),
            userId: user._id.toString(),
            userName: user.name || user.firstName || "User",
            mode,
            channelName,
            astrologerId: astrologer._id.toString()
          });
        }
      }

      // Broadcast to 'astrologers' room so dashboards can listen (fallback)
      io.to("astrologers").emit("incoming_request", {
        sessionId: session._id.toString(),
        userId: user._id.toString(),
        userName: user.name || user.firstName || "User",
        mode,
        channelName,
        astrologerId: astrologer._id.toString()
      });

      // Notify the user (in case UI needs to update)
      if (user.socketId) {
        io.to(user.socketId).emit("session:created", {
          sessionId: session._id.toString(),
          astrologerId: astrologer._id.toString(),
          status: session.status,
          channelName
        });
      }
    }

    return res.status(201).json({
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
  } catch (err) {
    console.error("createSession error:", err);
    return res.status(500).json({ success: false, message: "Failed to create session", error: err.message });
  }
};

// Astrologer accepts session
export const acceptSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    // req.userId in your system is clerkId (from Clerk), but astrologer may be identified by id too
    const requesterClerkId = req.userId || req.body.requesterClerkId;

    if (!sessionId) return res.status(400).json({ success: false, message: "sessionId is required" });

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    if (session.status !== "pending") {
      return res.status(400).json({ success: false, message: `Session is already ${session.status}` });
    }

    const astrologer = await Astrologer.findById(session.astrologerId);
    if (!astrologer) return res.status(404).json({ success: false, message: "Astrologer not found" });

    // Authorization: ensure the requester matches the astrologer (by clerkId or id)
    if (astrologer.clerkId && requesterClerkId && astrologer.clerkId !== requesterClerkId) {
      return res.status(403).json({ success: false, message: "Unauthorized: Only assigned astrologer can accept" });
    }

    // Mark session active
    session.status = "active";
    session.acceptedAt = new Date();
    session.acceptedBy = astrologer._id.toString();
    // For billing start time we can keep startTime as created; add activeAt if needed.
    session.activeAt = new Date();
    await session.save();

    // Ensure astrologer.online is true
    if (!astrologer.online) {
      astrologer.online = true;
      await astrologer.save();
    }

    // Notify user and astrologer via sockets
    const io = getIO();
    if (io) {
      // Notify user room (user may be connected to room `user:{id}` or have socketId)
      if (session.userId) {
        io.to(`user:${session.userId}`).emit("session:accepted", {
          sessionId: session._id.toString(),
          channelName: session.channelName,
          sessionType: session.sessionType,
          astrologerId: session.astrologerId
        });
      }

      // If user doc has socketId, notify directly
      const userDoc = await User.findById(session.userId);
      if (userDoc && userDoc.socketId) {
        io.to(userDoc.socketId).emit("session:accepted", {
          sessionId: session._id.toString(),
          channelName: session.channelName,
          sessionType: session.sessionType,
          astrologerId: session.astrologerId
        });
      }

      // Notify astrologer clients (their dashboard) as well
      if (astrologer.socketId) {
        io.to(astrologer.socketId).emit("session:accepted", {
          sessionId: session._id.toString(),
          channelName: session.channelName,
          sessionType: session.sessionType,
          userId: session.userId
        });
      }
    }

    return res.json({ success: true, session, message: "Session accepted successfully" });
  } catch (err) {
    console.error("acceptSession error:", err);
    return res.status(500).json({ success: false, message: "Failed to accept session", error: err.message });
  }
};

// Astrologer rejects session
export const rejectSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const requesterClerkId = req.userId || req.body.requesterClerkId;

    if (!sessionId) return res.status(400).json({ success: false, message: "sessionId is required" });

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    if (session.status !== "pending") {
      return res.status(400).json({ success: false, message: `Session is already ${session.status}` });
    }

    const astrologer = await Astrologer.findById(session.astrologerId);
    if (!astrologer) return res.status(404).json({ success: false, message: "Astrologer not found" });

    // Authorization
    if (astrologer.clerkId && requesterClerkId && astrologer.clerkId !== requesterClerkId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    session.status = "ended";
    session.endTime = new Date();
    await session.save();

    // Socket notify user
    const io = getIO();
    if (io) {
      if (session.userId) {
        io.to(`user:${session.userId}`).emit("session:rejected", {
          sessionId: session._id.toString(),
          message: "Astrologer declined your consultation request"
        });
      }
      const userDoc = await User.findById(session.userId);
      if (userDoc && userDoc.socketId) {
        io.to(userDoc.socketId).emit("session:rejected", {
          sessionId: session._id.toString(),
          message: "Astrologer declined your consultation request"
        });
      }
    }

    return res.json({ success: true, message: "Session rejected" });
  } catch (err) {
    console.error("rejectSession error:", err);
    return res.status(500).json({ success: false, message: "Failed to reject session", error: err.message });
  }
};

// End session (user or astrologer can end)
export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const requesterIdentifier = req.userId || req.body.requesterId;

    if (!sessionId) return res.status(400).json({ success: false, message: "sessionId is required" });

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    const astrologer = await Astrologer.findById(session.astrologerId);
    const user = await User.findById(session.userId);

    // Check requester is part of session
    let isUser = false;
    let isAstrologer = false;
    if (user) {
      // if requesterIdentifier is clerkId then compare, else compare objectId
      if (requesterIdentifier && user.clerkId && requesterIdentifier === user.clerkId) isUser = true;
      if (requesterIdentifier && mongoose.Types.ObjectId.isValid(requesterIdentifier) && requesterIdentifier === user._id.toString()) isUser = true;
    }
    if (astrologer) {
      if (requesterIdentifier && astrologer.clerkId && requesterIdentifier === astrologer.clerkId) isAstrologer = true;
      if (requesterIdentifier && mongoose.Types.ObjectId.isValid(requesterIdentifier) && requesterIdentifier === astrologer._id.toString()) isAstrologer = true;
    }

    if (!isUser && !isAstrologer) {
      return res.status(403).json({ success: false, message: "Unauthorized access to session" });
    }

    if (session.status === "ended") {
      return res.status(400).json({ success: false, message: "Session already ended" });
    }

    // Compute duration
    const endTime = new Date();
    // Prefer activeAt if set, else created startTime
    const started = session.activeAt || session.startTime || session.createdAt || new Date();
    const durationSeconds = Math.floor((endTime - new Date(started)) / 1000);
    const durationMinutes = Math.max(1, Math.ceil(durationSeconds / 60)); // minimum 1 minute billing unit

    // Billing calculation
    let coinsUsed = 0;
    const pricePerMin = Number((astrologer && astrologer.pricePerMin) || 0);

    if (session.sessionType === "chat") {
      // first 3 minutes free
      if (durationMinutes <= 3) {
        coinsUsed = 0;
      } else {
        const billable = durationMinutes - 3;
        coinsUsed = billable * pricePerMin;
      }
    } else {
      // audio/video billed for full duration
      coinsUsed = durationMinutes * pricePerMin;
    }

    // Deduct coins from user wallet (if available)
    if (user) {
      if (coinsUsed > 0) {
        if ((user.wallet || 0) < coinsUsed) {
          // charge as much as possible
          coinsUsed = user.wallet || 0;
          user.wallet = 0;
        } else {
          user.wallet = (user.wallet || 0) - coinsUsed;
        }

        // push transaction record (ensure your user model has transactions array)
        if (!Array.isArray(user.transactions)) user.transactions = [];
        user.transactions.push({
          type: "debit",
          amount: coinsUsed,
          description: `Consultation with ${astrologer ? astrologer.name : "astrologer"} (${session.sessionType}, ${durationMinutes} min)`,
          date: new Date()
        });

        await user.save();
      }
    }

    // Update session document
    session.status = "ended";
    session.endTime = endTime;
    session.duration = durationSeconds;
    session.coinsUsed = coinsUsed;
    await session.save();

    // Emit socket events to both parties
    const io = getIO();
    if (io) {
      if (session.userId) {
        io.to(`user:${session.userId}`).emit("session:ended", {
          sessionId: session._id.toString(),
          duration: durationSeconds,
          coinsUsed
        });
      }
      if (user && user.socketId) {
        io.to(user.socketId).emit("session:ended", {
          sessionId: session._id.toString(),
          duration: durationSeconds,
          coinsUsed
        });
      }
      if (astrologer && astrologer.socketId) {
        io.to(astrologer.socketId).emit("session:ended", {
          sessionId: session._id.toString(),
          duration: durationSeconds,
          coinsUsed
        });
      }
    }

    // Optionally update astrologer's online status left as-is
    return res.json({
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
  } catch (err) {
    console.error("endSession error:", err);
    return res.status(500).json({ success: false, message: "Failed to end session", error: err.message });
  }
};

// Get session by ID
export const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) return res.status(400).json({ success: false, message: "sessionId required" });

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    return res.json({ success: true, session });
  } catch (err) {
    console.error("getSession error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch session", error: err.message });
  }
};

// Get user's sessions (recent)
export const getUserSessions = async (req, res) => {
  try {
    const identifier = req.userId || req.query.userId;
    if (!identifier) return res.status(400).json({ success: false, message: "userId required" });

    const user = await resolveUser(identifier);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const sessions = await Session.find({ userId: user._id.toString() }).sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, sessions });
  } catch (err) {
    console.error("getUserSessions error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch sessions", error: err.message });
  }
};

// Get astrologer's sessions
export const getAstrologerSessions = async (req, res) => {
  try {
    const identifier = req.params.astrologerId || req.query.astrologerId || req.userId;
    if (!identifier) return res.status(400).json({ success: false, message: "astrologerId required" });

    const astrologer = await resolveAstrologer(identifier);
    if (!astrologer) return res.status(404).json({ success: false, message: "Astrologer not found" });

    const sessions = await Session.find({ astrologerId: astrologer._id.toString() }).sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, sessions });
  } catch (err) {
    console.error("getAstrologerSessions error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch sessions", error: err.message });
  }
};
