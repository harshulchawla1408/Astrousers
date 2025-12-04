import express from "express";
import {
  createSession,
  acceptSession,
  rejectSession,
  endSession,
  getSession,
  getUserSessions,
  getAstrologerSessions
} from "../controllers/sessionController.js";

const router = express.Router();

/**
 * IMPORTANT:
 * Clerk is used only on the frontend.
 * Backend gets userId (clerkId) from headers or body.
 *
 * We keep backend routes open and validate inside controllers.
 */

// START SESSION (User → Astrologer)
router.post("/start", createSession);

// ACCEPT SESSION (Astrologer)
router.post("/accept", acceptSession);

// REJECT SESSION (Astrologer)
router.post("/reject", rejectSession);

// END SESSION (User or Astrologer)
router.post("/end", endSession);

// Get ALL sessions for a User
router.get("/user/:userId", getUserSessions);

// Get ALL sessions for an Astrologer
router.get("/astrologer/:astrologerId", getAstrologerSessions);

// Get specific session BY ID
router.get("/details/:sessionId", getSession);

export default router;
