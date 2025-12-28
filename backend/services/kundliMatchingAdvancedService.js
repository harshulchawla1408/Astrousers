import axios from "axios";
import { getProkeralaToken } from "../config/prokeralaAuth.js";

export const fetchAdvancedKundliMatching = async ({
  girlDob,
  girlLat,
  girlLon,
  boyDob,
  boyLat,
  boyLon,
  ayanamsa = 1,
  language = "en",
}) => {
  // ✅ Strict validation (do NOT use !value for coordinates)
  if (
    !girlDob ||
    girlLat == null ||
    girlLon == null ||
    !boyDob ||
    boyLat == null ||
    boyLon == null
  ) {
    throw new Error("Missing required kundli matching parameters");
  }

  const token = await getProkeralaToken();

  try {
    const response = await axios.get(
      "https://api.prokerala.com/v2/astrology/kundli-matching/advanced",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ayanamsa,
          girl_coordinates: `${Number(girlLat)},${Number(girlLon)}`,
          girl_dob: girlDob, // axios encodes automatically
          boy_coordinates: `${Number(boyLat)},${Number(boyLon)}`,
          boy_dob: boyDob,   // axios encodes automatically
          la: language,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("🔥 PROKERALA KUNDLI MATCHING ERROR");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }

    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch kundli matching"
    );
  }
};
