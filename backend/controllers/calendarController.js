import { fetchCalendar } from "../services/calendarService.js";
import { analyzeCalendar } from "../utils/calendarAnalysis.js";

export const getCalendarData = async (req, res, next) => {
  try {
    const { date, calendar, language } = req.body;

    if (!date || !calendar) {
      return res.status(400).json({
        status: "error",
        message: "Date and calendar type are required",
      });
    }

    const apiData = await fetchCalendar({ date, calendar, language });
    const analysis = analyzeCalendar(apiData.data.calendar_date);

    res.json({
      status: "success",
      calendar: apiData.data.calendar_date,
      analysis,
    });
  } catch (err) {
    console.error("📅 Calendar fetch failed:", err.message);

    if (err.statusCode) {
      return res.status(err.statusCode).json({
        status: "error",
        message: err.message,
        details: err.details || null,
      });
    }

    next(err);
  }
};
