// ============================================
// Real, street-following directions for the places map
//
// Every other distance on this page (haversine.ts) is straight-line and
// never leaves the browser. Turn-by-turn geometry cannot be computed
// locally, so this is the one path in the app that sends coordinates to a
// third party — and only ever after someone explicitly taps "Directions",
// never automatically.
// ============================================

import type { Coordinates } from "./geo";

export interface RouteResult {
  /** Ordered [lat, lng] pairs tracing the actual street network. */
  path: [number, number][];
  distanceKm: number;
  durationMin: number;
}

/** OSRM's public demo server: free, no key, fine for light use. */
const OSRM_DRIVING_ENDPOINT = "https://router.project-osrm.org/route/v1/driving";

/**
 * The shortest driving route between two points, via OSRM. Throws on any
 * network failure, non-OK response, or empty result so the caller can show
 * a retry state rather than silently falling back to a straight line.
 */
export async function fetchDrivingRoute(
  origin: Coordinates,
  destination: Coordinates,
  signal?: AbortSignal
): Promise<RouteResult> {
  const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `${OSRM_DRIVING_ENDPOINT}/${coords}?overview=full&geometries=geojson`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Routing request failed with status ${response.status}`);
  }

  const data = await response.json();
  const route = data.routes?.[0];
  if (!route?.geometry?.coordinates?.length) {
    throw new Error("No route returned");
  }

  const path: [number, number][] = route.geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng]
  );

  return {
    path,
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
  };
}
