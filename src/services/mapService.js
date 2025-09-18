// src/services/mapService.js
import axios from "axios";

export const getRoute = async (origin, destination) => {
  try {
    const apiKey = process.env.GEOAPIFY_API_KEY;

    const url = `https://api.geoapify.com/v1/routing?waypoints=${origin.lat},${origin.lng}|${destination.lat},${destination.lng}&mode=drive&apiKey=${apiKey}`;

    const { data } = await axios.get(url);
    return data; // Geoapify response
  } catch (error) {
    console.error("Error fetching route:", error.message);
    throw new Error("Failed to fetch route");
  }
};
