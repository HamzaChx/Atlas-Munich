// ============================================
// Distance helpers for the "near me" places feature
//
// Everything here runs client-side against coordinates that are already
// public (place lat/lng ship in the page bundle). No network round-trip is
// needed to compute a distance, so the user's coordinates never have to
// leave the browser.
// ============================================

export interface Coordinates {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371;

const toRadians = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance between two points, in kilometers. */
export function haversineDistanceKm(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** "850 m" below a kilometer, "1.2 km" above it, localized to the given locale. */
export function formatDistanceKm(km: number, locale: string): string {
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${new Intl.NumberFormat(locale).format(meters)} m`;
  }
  const rounded = km < 10 ? Math.round(km * 10) / 10 : Math.round(km);
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(rounded)} km`;
}

/* Comfortable walking pace. Deliberately below the 5 km/h textbook figure:
   these are city streets with crossings and traffic lights. */
const WALK_KMH = 4.5;

/* In-vehicle average across Munich's U-Bahn, S-Bahn and tram, plus a fixed
   cost for walking to the stop and waiting for the next service. */
const TRANSIT_KMH = 20;
const TRANSIT_OVERHEAD_MIN = 11;

/* A straight line under-reads real street distance. Munich is not a grid,
   but it is not a maze either; this is the usual detour allowance. */
const DETOUR_FACTOR = 1.3;

/* Under this, always quote the walk even when the arithmetic says a train
   would shave a couple of minutes. Nobody waits on a platform to travel
   800 metres, and telling them to would make the estimate feel wrong.
   The cost is one ~5 min step at the floor, where a 21 min walk becomes a
   16 min ride. That is a real choice a person makes, not a modelling error. */
const WALK_ALWAYS_KM = 1.2;

export type TravelMode = "walk" | "transit";

export interface TravelEta {
  mode: TravelMode;
  minutes: number;
}

/**
 * A rough door-to-door time for a straight-line distance.
 *
 * This is an estimate, not routing: there is no directions API in play, and
 * the copy that renders it says so. It exists because "1.4 km" does not tell
 * a newcomer whether somewhere is reachable before a lecture, and "~18 min
 * walk" does.
 *
 * Past the always-walk floor it reports whichever mode is actually faster,
 * rather than switching at a fixed distance. A fixed switch produced the
 * absurd result that a further place could show a shorter time, because a
 * long walk was being quoted right up to the threshold while transit took
 * over just beyond it.
 */
export function travelEta(km: number): TravelEta {
  const streetKm = km * DETOUR_FACTOR;

  const walkMinutes = Math.max(1, Math.round((streetKm / WALK_KMH) * 60));
  if (km <= WALK_ALWAYS_KM) return { mode: "walk", minutes: walkMinutes };

  const transitMinutes = Math.max(
    1,
    Math.round((streetKm / TRANSIT_KMH) * 60 + TRANSIT_OVERHEAD_MIN)
  );

  return transitMinutes < walkMinutes
    ? { mode: "transit", minutes: transitMinutes }
    : { mode: "walk", minutes: walkMinutes };
}
