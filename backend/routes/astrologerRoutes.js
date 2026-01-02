import express from "express";
import {
  getAllAstrologers,
  getAstrologerById,
  getTopAstrologers,
  getOnlineAstrologers,
  createAstrologer,
  updateAstrologer,
  checkAstrologer
} from "../controllers/astrologerController.js";

import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

/*
PUBLIC
*/
router.get("/", getAllAstrologers);
router.get("/top", getTopAstrologers);
router.get("/online", getOnlineAstrologers);
router.get("/check/:clerkId", checkAstrologer);
router.get("/:id", getAstrologerById);

/*
PROTECTED
Astrologer creates/updates own profile
*/
router.post("/", requireAuth, createAstrologer);
router.put("/:id", requireAuth, updateAstrologer);

export default router;
