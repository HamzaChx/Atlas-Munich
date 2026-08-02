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

