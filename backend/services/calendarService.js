import axios from "axios";
import { getProkeralaToken } from "../config/prokeralaAuth.js";

export const fetchCalendar = async ({ date, calendar, language = "en" }) => {
  const token = await getProkeralaToken();

  const response = await axios.get(
    "https://api.prokerala.com/v2/calendar",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        date,
        calendar,
        la: language,
      },
    }
  );

  return response.data;
};
