import express from "express";
import { getCalendarData } from "../controllers/calendarController.js";

const router = express.Router();

router.post("/", getCalendarData);

export default router;
