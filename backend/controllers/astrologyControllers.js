import { fetchKundli } from "../services/kundliService.js";
import { fetchAdvancedKundli } from "../services/advancedKundliService.js";
import { fetchAdvancedKundliMatching } from "../services/kundliMatchingAdvancedService.js";
import { fetchPanchang } from "../services/panchangService.js";

export const getPanchang = async (req, res) => {
  try {
    const { date, time, lat, lon } = req.body;

    if (!date || !time || !lat || !lon) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const dateTime = `${date}T${time}:00+05:30`;

    const result = await fetchPanchang({
      dateTime,
      latitude: lat,
      longitude: lon,
    });

    res.json({
      success: true,
      data: result.data, // 👈 unwrap once here
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdvancedKundli = async (req, res) => {
  try {
    const { dob, tob, lat, lon, language } = req.body;

    if (!dob || !tob || !lat || !lon) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const dateTime = `${dob}T${tob}:00+05:30`;

    const result = await fetchAdvancedKundli({
      dateTime,
      latitude: lat,
      longitude: lon,
      language,
    });

    // IMPORTANT: unwrap data here (same mistake avoided)
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

export const getKundli = async (req, res) => {
  try {
    const {
      dob,   // YYYY-MM-DD
      tob,   // HH:mm
      lat,
      lon,
      language
    } = req.body;

    if (!dob || !tob || !lat || !lon) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ISO 8601 format
    const dateTime = `${dob}T${tob}:00+05:30`;

    const kundli = await fetchKundli({
      dateTime,
      latitude: lat,
      longitude: lon,
      language
    });

    res.status(200).json({
      success: true,
      data: kundli
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAdvancedKundliMatching = async (req, res) => {
  try {
    const {
      girlDob,
      girlLat,
      girlLon,
      boyDob,
      boyLat,
      boyLon,
    } = req.body;

    if (
      !girlDob ||
      !girlLat ||
      !girlLon ||
      !boyDob ||
      !boyLat ||
      !boyLon
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const result = await fetchAdvancedKundliMatching({
      girlDob,
      girlLat,
      girlLon,
      boyDob,
      boyLat,
      boyLon,
    });

    res.json({
      success: true,
      data: result.data, // 👈 unwrap once here
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
