import { Place } from "@/types";

/**
 * A Maps search URL biased toward the actual business listing rather than a
 * bare address pin: Google's text search matches far more reliably on
 * "name, address" than on the address alone, since the name is what
 * disambiguates the POI from a random point on the street.
 */
export function placeDirectionsUrl(place: Pick<Place, "name" | "address">) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${place.name}, ${place.address}`
  )}`;
}

/**
 * A multi-stop directions URL, so a planned route hands off to real turn-by-turn
 * navigation instead of dead-ending on our own map.
 *
 * Waypoint order is preserved: we already ordered the stops, and letting Google
 * re-optimise would silently disagree with the numbered list on screen.
 */
export function multiStopDirectionsUrl(
  stops: Pick<Place, "name" | "address">[],
  origin?: { lat: number; lng: number } | null
): string | null {
  if (stops.length === 0) return null;

  const label = (place: Pick<Place, "name" | "address">) => `${place.name}, ${place.address}`;
  const params = new URLSearchParams({ api: "1", travelmode: "transit" });

  if (origin) params.set("origin", `${origin.lat},${origin.lng}`);
  else params.set("origin", label(stops[0]));

  params.set("destination", label(stops[stops.length - 1]));

  // Everything between the ends. With no shared origin the first stop is the
  // start, so it must not also appear as a waypoint.
  const middle = stops.slice(origin ? 0 : 1, stops.length - 1);
  if (middle.length > 0) params.set("waypoints", middle.map(label).join("|"));

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
