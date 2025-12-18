import axios from "axios";
import { getProkeralaToken } from "../config/prokeralaAuth.js";

export const fetchPanchang = async ({
  dateTime,
  latitude,
  longitude,
  language = "en",
  ayanamsa = 1,
}) => {
  const token = await getProkeralaToken();

  const response = await axios.get(
    "https://api.prokerala.com/v2/astrology/panchang/advanced",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        ayanamsa,
        coordinates: `${latitude},${longitude}`,
        datetime: dateTime,
        la: language,
      },
    }
  );

  return response.data;
};
