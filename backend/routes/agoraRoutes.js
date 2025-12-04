// backend/routes/agoraRoutes.js
import express from "express";
import pkg from "agora-access-token";
import Session from "../models/sessionModel.js";

const router = express.Router();
const { RtcTokenBuilder, RtcRole } = pkg;

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERT = process.env.AGORA_APP_CERTIFICATE;

// Helper to generate random Agora UID
const randomUID = () => Math.floor(100000 + Math.random() * 900000);

/**
 * ----------------------------------------------------------
 *  🔥 GENERATE AGORA TOKEN FOR ACTIVE SESSION
 *  POST /api/v1/agora/token
 * ----------------------------------------------------------
 */
router.post("/token", async (req, res) => {
  try {
    const { sessionId, requesterId } = req.body;

    if (!APP_ID || !APP_CERT) {
      return res.status(500).json({
        success: false,
        message: "Agora credentials missing"
      });
    }

    if (!sessionId || !requesterId) {
      return res.status(400).json({
        success: false,
        message: "sessionId and requesterId are required"
      });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    // Check that requester is either user or astrologer
    const isUser = session.userId === requesterId;
    const isAstro = session.astrologerId === requesterId;

    if (!isUser && !isAstro) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized for this session"
      });
    }

    const channelName = session.channelName;

    // Assign uids
    let uidUser = session.agora?.uidUser || randomUID();
    let uidAstrologer = session.agora?.uidAstrologer || randomUID();

    const uid = isUser ? uidUser : uidAstrologer;

    const role = RtcRole.PUBLISHER;
    const expireSeconds = 3600;
    const ts = Math.floor(Date.now() / 1000) + expireSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERT,
      channelName,
      uid,
      role,
      ts
    );

    // Save Agora info in DB only once
    if (!session.agora || !session.agora.uidUser) {
      session.agora = {
        channel: channelName,
        uidUser,
        uidAstrologer,
        token
      };
      await session.save();
    }

    return res.json({
      success: true,
      token,
      channelName,
      appId: APP_ID,
      uid,
      role: isUser ? "user" : "astrologer"
    });
  } catch (err) {
    console.error("Agora token error:", err);
    return res.status(500).json({
      success: false,
      message: "Could not generate token",
      error: err.message
    });
  }
});

/**
 * ----------------------------------------------------------
 *  🔥 RTM TOKEN GENERATION (SAFE WAY)
 *  GET /api/v1/agora/rtm-token?uid=xxx
 * ----------------------------------------------------------
 */
router.get("/rtm-token", (req, res) => {
  try {
    const { uid } = req.query;

    if (!APP_ID || !APP_CERT) {
      return res.status(500).json({ message: "Agora credentials missing" });
    }

    if (!uid) {
      return res.status(400).json({
        message: "UID is required for RTM"
      });
    }

    const expireSeconds = 3600;
    const ts = Math.floor(Date.now() / 1000) + expireSeconds;

    // RTM token uses PUBLISHER role
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERT,
      uid,
      Number(uid),
      RtcRole.PUBLISHER,
      ts
    );

    return res.json({
      success: true,
      token,
      uid
    });
  } catch (error) {
    console.error("RTM token error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create RTM token"
    });
  }
});

export default router;
