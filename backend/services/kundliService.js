import axios from "axios";
import { getProkeralaToken } from "../config/prokeralaAuth.js";

export const fetchKundli = async ({
  dateTime,
  latitude,
  longitude,
  language = "en",
  ayanamsa = 1
}) => {
  const token = await getProkeralaToken();

  const url = `${process.env.PROKERALA_BASE_URL}/v2/astrology/kundli`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ayanamsa,
        coordinates: `${latitude},${longitude}`,
        datetime: dateTime,
        la: language
      }
    });

    return response.data;
  } catch (error) {
    console.error("❌ Kundli API Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch kundli");
  }
};
