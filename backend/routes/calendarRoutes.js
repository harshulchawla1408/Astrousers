import express from "express";
import { getCalendarData } from "../controllers/calendarController.js";
import { verifyFirebaseToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/calendar", verifyFirebaseToken, getCalendarData);

export default router;
