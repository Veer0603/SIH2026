// Delhi NCR Locality Geocoding & Distance Utility

import { DELHI_STATIONS } from '../data/delhiStationsData.js';

// Extended local lookup database for instantaneous zero-latency Delhi neighborhood searching
const LOCAL_DELHI_NEIGHBORHOODS = [
  { name: "Anand Vihar", lat: 28.6469, lng: 77.3162, stationId: "anand-vihar" },
  { name: "Connaught Place", lat: 28.6315, lng: 77.2167, stationId: "connaught-place" },
  { name: "Rajiv Chowk", lat: 28.6328, lng: 77.2197, stationId: "connaught-place" },
  { name: "Punjabi Bagh", lat: 28.6683, lng: 77.1247, stationId: "punjabi-bagh" },
  { name: "Dwarka Sector 8", lat: 28.5714, lng: 77.0716, stationId: "dwarka-sec8" },
  { name: "Dwarka Sector 21", lat: 28.5521, lng: 77.0581, stationId: "dwarka-sec8" },
  { name: "Janakpuri", lat: 28.6219, lng: 77.0878, stationId: "dwarka-sec8" },
  { name: "R.K. Puram", lat: 28.5644, lng: 77.1751, stationId: "rk-puram" },
  { name: "Vasant Kunj", lat: 28.5293, lng: 77.1539, stationId: "rk-puram" },
  { name: "Rohini Sector 16", lat: 28.7325, lng: 77.1199, stationId: "rohini" },
  { name: "Pitampura", lat: 28.6990, lng: 77.1384, stationId: "rohini" },
  { name: "ITO Crossing", lat: 28.6286, lng: 77.2410, stationId: "ito" },
  { name: "Laxmi Nagar", lat: 28.6304, lng: 77.2772, stationId: "anand-vihar" },
  { name: "Saket", lat: 28.5244, lng: 77.2100, stationId: "saket" },
  { name: "Greater Kailash", lat: 28.5481, lng: 77.2346, stationId: "saket" },
  { name: "Chandni Chowk", lat: 28.6506, lng: 77.2303, stationId: "chandni-chowk" },
  { name: "Red Fort", lat: 28.6562, lng: 77.2410, stationId: "chandni-chowk" },
  { name: "Noida Sector 62", lat: 28.6243, lng: 77.3649, stationId: "noida-sec62" },
  { name: "Noida Sector 18", lat: 28.5708, lng: 77.3260, stationId: "noida-sec62" },
  { name: "Gurugram Cyber City", lat: 28.4950, lng: 77.0895, stationId: "gurugram-cyberhub" },
  { name: "MG Road Gurugram", lat: 28.4800, lng: 77.0800, stationId: "gurugram-cyberhub" },
  { name: "Vasundhara Ghaziabad", lat: 28.6609, lng: 77.3573, stationId: "vasundhara-ghaziabad" },
  { name: "Indirapuram Ghaziabad", lat: 28.6415, lng: 77.3712, stationId: "vasundhara-ghaziabad" }
];

/**
 * Calculates straight line distance between two coordinates in kilometers (Haversine formula)
 */
export function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Finds the nearest monitoring station from any lat, lng coordinate
 */
export function findNearestStation(lat, lng) {
  let nearest = DELHI_STATIONS[0];
  let minDistance = Infinity;

  DELHI_STATIONS.forEach((station) => {
    const dist = getDistanceKm(lat, lng, station.lat, station.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = station;
    }
  });

  return {
    station: nearest,
    distanceKm: minDistance
  };
}

/**
 * Geocodes a typed query across Delhi NCR using OpenStreetMap Nominatim + Instant Local Fallback
 */
export async function searchDelhiLocality(query) {
  if (!query || query.trim().length === 0) return [];

  const cleanQuery = query.trim().toLowerCase();

  // 1. Check local instant database first
  const localMatches = LOCAL_DELHI_NEIGHBORHOODS.filter((item) =>
    item.name.toLowerCase().includes(cleanQuery)
  );

  const results = localMatches.map((item) => {
    const stationMatch = DELHI_STATIONS.find((s) => s.id === item.stationId) || DELHI_STATIONS[0];
    const dist = getDistanceKm(item.lat, item.lng, stationMatch.lat, stationMatch.lng);
    return {
      displayName: `${item.name}, Delhi NCR`,
      lat: item.lat,
      lng: item.lng,
      nearestStation: stationMatch,
      distanceKm: dist,
      source: "Local High-Precision DB"
    };
  });

  // 2. Fetch from OpenStreetMap Nominatim with bounding box for Delhi NCR if network allows
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query + ", Delhi NCR, India"
    )}&viewbox=76.8,28.4,77.5,28.9&bounded=1&limit=5`;

    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en'
      }
    });

    if (response.ok) {
      const data = await response.json();
      data.forEach((item) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        // Ensure result doesn't duplicate existing local result
        if (!results.some((r) => Math.abs(r.lat - lat) < 0.01 && Math.abs(r.lng - lng) < 0.01)) {
          const { station, distanceKm } = findNearestStation(lat, lng);
          results.push({
            displayName: item.display_name.split(',').slice(0, 3).join(','),
            lat,
            lng,
            nearestStation: station,
            distanceKm,
            source: "OpenStreetMap Geocoder"
          });
        }
      });
    }
  } catch (err) {
    console.warn("Geocoding network fetch fallback to local database:", err);
  }

  return results;
}
