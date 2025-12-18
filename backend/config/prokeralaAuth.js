// backend/config/prokeralaAuth.js
import axios from "axios";

let accessToken = null;
let tokenExpiry = null;

export const getProkeralaToken = async () => {
  // If token exists and not expired → reuse
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      `${process.env.PROKERALA_BASE_URL}/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.PROKERALA_CLIENT_ID,
        client_secret: process.env.PROKERALA_CLIENT_SECRET
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;

    console.log("✅ Prokerala Token Refreshed");
    return accessToken;
  } catch (error) {
    console.error("❌ Prokerala Auth Error:", error.response?.data || error.message);
    throw new Error("Failed to authenticate with Prokerala");
  }
};