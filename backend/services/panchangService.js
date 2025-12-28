import axios from "axios";
import { getProkeralaToken } from "../config/prokeralaAuth.js";

export const fetchPanchang = async ({
  dateTime,
  latitude,
  longitude,
  language = "en",
  ayanamsa = 1,
}) => {
  if (!dateTime || latitude == null || longitude == null) {
    throw new Error("Missing required parameters for Panchang");
  }

  const token = await getProkeralaToken();

  try {
    const response = await axios.get(
      "https://api.prokerala.com/v2/astrology/panchang/advanced",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ayanamsa,
          coordinates: `${Number(latitude)},${Number(longitude)}`,
          datetime: dateTime,
          la: language,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ PANCHANG API ERROR");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }

    throw new Error(
      error.response?.data?.message || "Failed to fetch Panchang"
    );
  }
};
