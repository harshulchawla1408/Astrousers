import express from "express";
import {
  getAllAstrologers,
  getAstrologerById,
  createAstrologer,
  updateAstrologer,
  deleteAstrologer,
  getTopAstrologers,
  makeAllAstrologersOnline,
  setAstrologerOnline,
  setAstrologerOffline,
  getOnlineAstrologers,
  checkAstrologerByClerkId
} from "../controllers/astrologerController.js";
import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

// Routes
router.get("/", getAllAstrologers);
router.get("/top", getTopAstrologers);
router.get("/online", getOnlineAstrologers);
router.get("/check/:clerkId", checkAstrologerByClerkId); // Check if clerkId is astrologer
router.get("/:id", getAstrologerById);
router.post("/", createAstrologer);
router.put("/:id", updateAstrologer);
router.delete("/:id", deleteAstrologer);
router.post("/make-online", makeAllAstrologersOnline);
// Presence endpoints (require auth)
router.post("/:id/online", requireAuth, setAstrologerOnline);
router.post("/:id/offline", requireAuth, setAstrologerOffline);

export default router;
