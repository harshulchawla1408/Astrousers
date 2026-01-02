import express from "express";
import pkg from "agora-access-token";
import Session from "../models/sessionModel.js";
import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();
const { RtcTokenBuilder, RtcRole } = pkg;

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERT = process.env.AGORA_APP_CERTIFICATE;

const randomUID = () => Math.floor(100000 + Math.random() * 900000);

/*
================================================
GENERATE AGORA TOKEN (ACTIVE SESSION ONLY)
================================================
*/
router.post("/token", requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const { sessionId } = req.body;

    if (!APP_ID || !APP_CERT) {
      return res.status(500).json({ success: false });
    }

    const session = await Session.findById(sessionId);
    if (!session || session.status !== "active") {
      return res.status(400).json({ success: false });
    }

    const isUser = session.userId.toString() === user._id.toString();
    const isAstro = session.astrologerId.toString() === user._id.toString();

    if (!isUser && !isAstro) {
      return res.status(403).json({ success: false });
    }

    const uidUser = session.uidUser || randomUID();
    const uidAstrologer = session.uidAstrologer || randomUID();
    const uid = isUser ? uidUser : uidAstrologer;

    const expire = Math.floor(Date.now() / 1000) + 3600;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERT,
      session.channelName,
      uid,
      RtcRole.PUBLISHER,
      expire
    );

    session.uidUser = uidUser;
    session.uidAstrologer = uidAstrologer;
    await session.save();

    res.json({
      success: true,
      token,
      channelName: session.channelName,
      appId: APP_ID,
      uid
    });
  } catch (err) {
    console.error("Agora token error", err);
    res.status(500).json({ success: false });
  }
});

export default router;
