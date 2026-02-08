import axios from "axios";
import { getProkeralaToken } from "../config/prokeralaAuth.js";

const buildFallbackCalendar = ({ date, calendar }) => {
  const calendarProfiles = {
    tamil: {
      year_name: "Pilava",
      month_name: "Thai",
      day: 4,
    },
    malayalam: {
      year_name: "Chitrabhanu",
      month_name: "Kumbham",
      day: 11,
    },
    "shaka-samvat": {
      year_name: "Shobhakrit",
      month_name: "Chaitra",
      day: 12,
    },
    "vikram-samvat": {
      year_name: "Vikrama",
      month_name: "Vaishakha",
      day: 9,
    },
    amanta: {
      year_name: "Sadharana",
      month_name: "Kartika",
      day: 6,
    },
    purnimanta: {
      year_name: "Parabhava",
      month_name: "Magha",
      day: 17,
    },
    hijri: {
      year_name: "1448 AH",
      month_name: "Sha'ban",
      day: 8,
    },
    gujarati: {
      year_name: "Vikram Samvat 2081",
      month_name: "Magsar",
      day: 2,
    },
    bengali: {
      year_name: "Bongabdo 1432",
      month_name: "Joishtho",
      day: 19,
    },
    lunar: {
      year_name: "Chandramasa",
      month_name: "Ashadha",
      day: 15,
    },
  };

  const fallback = calendarProfiles[calendar] || calendarProfiles["shaka-samvat"];

  return {
    source: "fallback",
    date,
    calendar,
    data: {
      calendar_date: {
        ...fallback,
      },
    },
  };
};

export const fetchCalendar = async ({ date, calendar, language = "en" }) => {
  try {
    const token = await getProkeralaToken();

    const response = await axios.get("https://api.prokerala.com/v2/calendar", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        date,
        calendar,
        la: language,
      },
    });

    return response.data;
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch calendar";

    console.error("❌ Calendar API request failed:", {
      statusCode,
      message,
      data: error.response?.data,
    });

    if (statusCode === 401 || statusCode === 403) {
      console.warn("⚠️ Using fallback calendar data due to authorization failure.");
      return buildFallbackCalendar({ date, calendar });
    }

    const err = new Error(message);
    err.statusCode = statusCode;
    err.details = error.response?.data;
    throw err;
  }
};
