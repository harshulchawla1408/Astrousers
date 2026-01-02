import express from "express";
import {
  createSession,
  acceptSession,
  endSession,
  getSession,
  getUserSessions,
  getAstrologerSessions
} from "../controllers/sessionController.js";

import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

/*
USER → START SESSION
*/
router.post("/start", requireAuth, createSession);

/*
ASTROLOGER → ACCEPT
*/
router.post("/accept", requireAuth, acceptSession);

/*
END SESSION (ANY PARTICIPANT)
*/
router.post("/end", requireAuth, endSession);

/*
FETCH
*/
router.get("/details/:sessionId", requireAuth, getSession);
router.get("/user", requireAuth, getUserSessions);
router.get("/astrologer", requireAuth, getAstrologerSessions);

export default router;
