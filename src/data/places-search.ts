// ============================================
// Atlas Munich – places filter/search
//
// Extracted from PlacesExplorer.tsx so the same category/price/district/
// cuisine/text/radius filter chain can run server-side too (Jmila's map
// tool). A tool call can't read `navigator.geolocation`, so `near` takes
// explicit coordinates rather than being derived from browser state.
// ============================================

import type { Place, PlaceCategory, PriceLevel } from "@/types";
import { haversineDistanceKm } from "@/lib/geo";

export interface PlaceFilters {
  category?: PlaceCategory;
  price?: PriceLevel;
  district?: string;
  cuisineTag?: string;
  query?: string;
  near?: { lat: number; lng: number; radiusKm?: number };
}

export function filterPlaces(places: Place[], filters: PlaceFilters = {}): Place[] {
  let result = places;

  if (filters.near) {
    const origin = filters.near;
    result = result.map((place) =>
      typeof place.lat === "number" && typeof place.lng === "number"
        ? { ...place, distanceKm: haversineDistanceKm(origin, { lat: place.lat, lng: place.lng }) }
        : place
    );
  }

  if (filters.category) {
    const category = filters.category;
    result = result.filter((place) => place.category === category);
  }

  if (filters.price) {
    const price = filters.price;
    result = result.filter((place) => place.price === price);
  }

  if (filters.district) {
    const district = filters.district;
    result = result.filter((place) => place.district === district);
  }

  if (filters.cuisineTag) {
    const cuisineTag = filters.cuisineTag;
    result = result.filter(
      (place) => place.category === "restaurant" && place.tags.includes(cuisineTag)
    );
  }

  if (filters.query?.trim()) {
    const tokens = filters.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const haystack = (place: Place) =>
      [place.name, place.address, ...place.tags, place.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    const strictMatches = result.filter((place) =>
      tokens.every((t) => haystack(place).includes(t))
    );
    // A free-text query is often several words describing different facets
    // (a cuisine plus a landmark, e.g. "halal restaurant near Münchner
    // Freiheit") that rarely all appear verbatim on the same place — a
    // single relevant word (any one of them) beats returning nothing.
    result =
      strictMatches.length > 0 || tokens.length <= 1
        ? strictMatches
        : result.filter((place) => tokens.some((t) => haystack(place).includes(t)));
  }

  if (filters.near) {
    if (filters.near.radiusKm) {
      const radiusKm = filters.near.radiusKm;
      result = result.filter(
        (place) => place.distanceKm !== undefined && place.distanceKm <= radiusKm
      );
    }
    // "Near me" implies proximity order is the point of turning it on.
    result = [...result].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  }

  return result;
}
