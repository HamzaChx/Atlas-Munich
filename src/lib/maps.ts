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
