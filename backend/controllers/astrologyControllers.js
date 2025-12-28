import { fetchKundli } from "../services/kundliService.js";
import { fetchAdvancedKundli } from "../services/advancedKundliService.js";
import { fetchAdvancedKundliMatching } from "../services/kundliMatchingAdvancedService.js";
import { fetchPanchang } from "../services/panchangService.js";
import { geocodeLocation } from "../services/geocodingService.js";

/**
 * Helper: resolve latitude & longitude
 * Supports BOTH:
 * 1. Direct lat/lon
 * 2. city/state/country
 */
const resolveCoordinates = async ({
  lat,
  lon,
  city,
  state,
  country,
}) => {
  if (lat && lon) {
    return { lat, lon };
  }

  if (city && country) {
    return await geocodeLocation({ city, state, country });
  }

  throw new Error("Location information is missing");
};

/* ---------------- PANCHANG ---------------- */

export const getPanchang = async (req, res) => {
  try {
    const { date, time, lat, lon, city, state, country } = req.body;

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: "Date and time are required",
      });
    }

    const coords = await resolveCoordinates({
      lat,
      lon,
      city,
      state,
      country,
    });

    const dateTime = `${date}T${time}:00+05:30`;

    const result = await fetchPanchang({
      dateTime,
      latitude: coords.lat,
      longitude: coords.lon,
    });

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ---------------- ADVANCED KUNDLI ---------------- */

export const getAdvancedKundli = async (req, res) => {
  try {
    const {
      dob,
      tob,
      lat,
      lon,
      city,
      state,
      country,
      language,
    } = req.body;

    if (!dob || !tob) {
      return res.status(400).json({
        success: false,
        message: "DOB and Time of Birth are required",
      });
    }

    const coords = await resolveCoordinates({
      lat,
      lon,
      city,
      state,
      country,
    });

    const dateTime = `${dob}T${tob}:00+05:30`;

    const result = await fetchAdvancedKundli({
      dateTime,
      latitude: coords.lat,
      longitude: coords.lon,
      language,
    });

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ---------------- BASIC KUNDLI ---------------- */

export const getKundli = async (req, res) => {
  try {
    const {
      dob,
      tob,
      lat,
      lon,
      city,
      state,
      country,
      language,
    } = req.body;

    if (!dob || !tob) {
      return res.status(400).json({
        success: false,
        message: "DOB and Time of Birth are required",
      });
    }

    const coords = await resolveCoordinates({
      lat,
      lon,
      city,
      state,
      country,
    });

    const dateTime = `${dob}T${tob}:00+05:30`;

    const kundli = await fetchKundli({
      dateTime,
      latitude: coords.lat,
      longitude: coords.lon,
      language,
    });

    res.status(200).json({
      success: true,
      data: kundli,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ---------------- KUNDLI MATCHING (ADVANCED) ---------------- */

export const getAdvancedKundliMatching = async (req, res) => {
  try {
    const {
      girlDob,
      girlLat,
      girlLon,
      girlCity,
      girlState,
      girlCountry,
      boyDob,
      boyLat,
      boyLon,
      boyCity,
      boyState,
      boyCountry,
    } = req.body;

    if (!girlDob || !boyDob) {
      return res.status(400).json({
        success: false,
        message: "Birth details for both profiles are required",
      });
    }

    const girlCoords = await resolveCoordinates({
      lat: girlLat,
      lon: girlLon,
      city: girlCity,
      state: girlState,
      country: girlCountry,
    });

    const boyCoords = await resolveCoordinates({
      lat: boyLat,
      lon: boyLon,
      city: boyCity,
      state: boyState,
      country: boyCountry,
    });

    const result = await fetchAdvancedKundliMatching({
      girlDob,
      girlLat: girlCoords.lat,
      girlLon: girlCoords.lon,
      boyDob,
      boyLat: boyCoords.lat,
      boyLon: boyCoords.lon,
    });

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
