import axios from "axios";

/**
 * Convert city/state/country to latitude & longitude
 */
export const geocodeLocation = async ({ city, state, country }) => {
  if (!city || !country) {
    throw new Error("City and country are required for geocoding");
  }

  const query = [city, state, country].filter(Boolean).join(", ");

  const { data } = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: query,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "astrousers-backend",
      },
    }
  );

  if (!data || data.length === 0) {
    throw new Error("Unable to find coordinates for location");
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
};
