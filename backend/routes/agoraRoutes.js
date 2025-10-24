import express from "express";
import pkg from "agora-access-token";

const router = express.Router();
const { RtcTokenBuilder, RtcRole } = pkg;

// Generate Agora token for video/audio calls
router.get("/token", (req, res) => {
  try {
    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const channelName = req.query.channel;
    const uid = req.query.uid || 0;
    const role = req.query.role === 'subscriber' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    if (!appID || !appCertificate) {
      return res.status(500).json({ 
        error: "Agora credentials not configured" 
      });
    }

    if (!channelName) {
      return res.status(400).json({ 
        error: "Channel name is required" 
      });
    }

    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    res.json({ 
      token,
      appId: appID,
      channel: channelName,
      uid: uid,
      role: role
    });
  } catch (error) {
    console.error("Error generating Agora token:", error);
    res.status(500).json({ 
      error: "Failed to generate token" 
    });
  }
});

// Generate token for chat (using Agora RTM for messaging)
router.get("/rtm-token", (req, res) => {
  try {
    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const userId = req.query.userId;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    if (!appID || !appCertificate) {
      return res.status(500).json({ 
        error: "Agora credentials not configured" 
      });
    }

    if (!userId) {
      return res.status(400).json({ 
        error: "User ID is required" 
      });
    }

    // For RTM, we use a different token builder
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      userId,
      userId,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );

    res.json({ 
      token,
      appId: appID,
      userId: userId
    });
  } catch (error) {
    console.error("Error generating RTM token:", error);
    res.status(500).json({ 
      error: "Failed to generate RTM token" 
    });
  }
});

export default router;
