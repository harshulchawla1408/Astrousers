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
  if (
    !girlDob ||
    !girlLat ||
    !girlLon ||
    !boyDob ||
    !boyLat ||
    !boyLon
  ) {
    throw new Error("Missing required kundli matching parameters");
  }

  const token = await getProkeralaToken();

  // ✅ CRITICAL FIX: encode datetime
  const encodedGirlDob = encodeURIComponent(girlDob);
  const encodedBoyDob = encodeURIComponent(boyDob);

  try {
    const response = await axios.get(
      "https://api.prokerala.com/v2/astrology/kundli-matching/advanced",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ayanamsa,
          girl_coordinates: `${girlLat},${girlLon}`,
          girl_dob: encodedGirlDob,
          boy_coordinates: `${boyLat},${boyLon}`,
          boy_dob: encodedBoyDob,
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
