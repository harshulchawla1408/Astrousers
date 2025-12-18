import express from "express";
import { getKundli } from "../controllers/astrologyControllers.js";
import { getAdvancedKundli } from "../controllers/astrologyControllers.js";
import { getAdvancedKundliMatching } from "../controllers/astrologyControllers.js";
import { getPanchang } from "../controllers/astrologyControllers.js";


const router = express.Router();

// POST because DOB / TOB are sensitive
router.post("/kundli", getKundli);
router.post("/kundli/advanced", getAdvancedKundli);
router.post("/kundli/matching/advanced", getAdvancedKundliMatching);
router.post("/panchang", getPanchang);

export default router;
