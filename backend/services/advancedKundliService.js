import axios from "axios";
import { getProkeralaToken } from "../config/prokeralaAuth.js";

export const fetchAdvancedKundli = async ({
  dateTime,
  latitude,
  longitude,
  language = "en",
  ayanamsa = 1,
  yearLength = 1,
}) => {
  const token = await getProkeralaToken();

  const url = "https://api.prokerala.com/v2/astrology/kundli/advanced";

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      ayanamsa,
      coordinates: `${latitude},${longitude}`,
      datetime: dateTime,
      la: language,
      year_length: yearLength,
    },
  });

  return response.data;
};
