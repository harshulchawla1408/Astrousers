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

// Start a new consultation session
router.post("/start", createSession);

// Astrologer accepts session
router.post("/accept", acceptSession);

// Astrologer rejects session
router.post("/reject", rejectSession);

// End session (user or astrologer)
router.post("/end", endSession);

// Get session by ID
router.get("/:sessionId", getSession);

// Get user's sessions
router.get("/user/:userId", getUserSessions);

// Get astrologer's sessions
router.get("/astrologer/:astrologerId", getAstrologerSessions);

export default router;
