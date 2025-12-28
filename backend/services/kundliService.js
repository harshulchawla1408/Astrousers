import axios from "axios";
import { getProkeralaToken } from "../config/prokeralaAuth.js";

export const fetchKundli = async ({
  dateTime,
  latitude,
  longitude,
  language = "en",
  ayanamsa = 1,
}) => {
  if (!dateTime || latitude == null || longitude == null) {
    throw new Error("Missing required parameters for Kundli");
  }

  const token = await getProkeralaToken();

  const url = `${process.env.PROKERALA_BASE_URL}/v2/astrology/kundli`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        ayanamsa,
        coordinates: `${Number(latitude)},${Number(longitude)}`,
        datetime: dateTime,
        la: language,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Kundli API Error");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }

    throw new Error(
      error.response?.data?.message || "Failed to fetch kundli"
    );
  }
};
