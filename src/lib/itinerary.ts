// ============================================
// Atlas Munich – trip planning
//
// The map answered "where is one place?" well and "what should my afternoon
// look like?" not at all. Picking a few stops and getting them in a sensible
// order, with a total time and a hand-off to real navigation, is the gap.
//
// Ordering is a nearest-neighbour walk, not an optimal tour. Solving TSP
// exactly is pointless here: the list is capped at five stops, the input is
// straight-line distance rather than street routing, and being one swap off
// optimal costs a couple of minutes. It runs instantly and never surprises
// the reader with a route that reorders itself unpredictably.
// ============================================

import type { Place } from "@/types";
import { haversineDistanceKm, travelEta, type Coordinates } from "./geo";

/** Beyond this the ordering stops helping and the map gets unreadable. */
export const MAX_STOPS = 5;

export interface ItineraryLeg {
  from: Coordinates;
  to: Place;
  distanceKm: number;
  minutes: number;
}

export interface Itinerary {
  /** Stops in visiting order. */
  stops: Place[];
  legs: ItineraryLeg[];
  totalKm: number;
  /** Travel time only. Time spent at each stop is the reader's business. */
  totalMinutes: number;
}

const coordsOf = (place: Place): Coordinates | null =>
  place.lat !== undefined && place.lng !== undefined
    ? { lat: place.lat, lng: place.lng }
    : null;

/**
 * Order stops by repeatedly hopping to the closest one not yet visited.
 *
 * `origin` is the reader's position when they have shared it. Without it the
 * first selected stop is treated as the start, so the feature still works for
 * someone planning from their laptop who never granted location.
 */
export function planItinerary(places: Place[], origin: Coordinates | null): Itinerary {
  const remaining = places.filter(coordsOf).slice(0, MAX_STOPS);

  const stops: Place[] = [];
  const legs: ItineraryLeg[] = [];

  let cursor = origin;
  if (!cursor && remaining.length > 0) {
    // No shared location: start from the first pick and route out from there.
    const [first] = remaining.splice(0, 1);
    stops.push(first);
    cursor = coordsOf(first)!;
  }

  while (remaining.length > 0 && cursor) {
    let bestIndex = 0;
    let bestKm = Infinity;

    remaining.forEach((candidate, index) => {
      const km = haversineDistanceKm(cursor!, coordsOf(candidate)!);
      if (km < bestKm) {
        bestKm = km;
        bestIndex = index;
      }
    });

    const [next] = remaining.splice(bestIndex, 1);
    legs.push({
      from: cursor,
      to: next,
      distanceKm: bestKm,
      minutes: travelEta(bestKm).minutes,
    });
    stops.push(next);
    cursor = coordsOf(next)!;
  }

  return {
    stops,
    legs,
    totalKm: legs.reduce((sum, leg) => sum + leg.distanceKm, 0),
    totalMinutes: legs.reduce((sum, leg) => sum + leg.minutes, 0),
  };
}

/** The ordered stop coordinates, for drawing the route on the map. */
export function itineraryPath(itinerary: Itinerary, origin: Coordinates | null): [number, number][] {
  const points: [number, number][] = [];
  if (origin) points.push([origin.lat, origin.lng]);
  itinerary.stops.forEach((stop) => {
    const c = coordsOf(stop);
    if (c) points.push([c.lat, c.lng]);
  });
  return points;
}
