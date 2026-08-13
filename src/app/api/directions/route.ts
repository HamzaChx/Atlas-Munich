import { NextRequest, NextResponse } from "next/server";

/**
 * Street-following directions for the places map, proxied through our own
 * origin rather than called from the browser.
 *
 * Why a proxy and not a direct fetch from the client:
 *
 * - Privacy. A direct browser call would hand the routing service the
 *   visitor's IP address alongside their exact coordinates, which together
 *   identify a person at a place at a time. Going through here, the routing
 *   service sees only this server's address; it never learns who asked.
 *   Coordinates are held in memory for the length of one request, are never
 *   logged, never written to disk, and never associated with a session,
 *   cookie, or account — there is no identifier here to associate them with.
 * - Content Security Policy. `connect-src` is `'self'` (next.config.ts) and
 *   stays that way: whitelisting a third-party host for every page is a
 *   bigger hole than this endpoint is worth.
 * - Substitutability. Swapping routing providers is a change to this file,
 *   not to a CSP header and a client bundle.
 *
 * Requests are POST specifically so that coordinates travel in the body.
 * A GET would put them in the URL, and URLs are what end up in access logs,
 * proxy logs, and error reports — the one place location data must not go.
 */

/** The public OSRM demo server, hosted in the EU by FOSSGIS e.V. */
const OSRM_ENDPOINT = "https://router.project-osrm.org/route/v1/driving";

/** Per-attempt budget. OSRM's demo server is occasionally slow, not hung. */
const UPSTREAM_TIMEOUT_MS = 8000;

/**
 * This is an unauthenticated endpoint, so it is deliberately only useful for
 * the thing the app does: routing around Munich. The box covers the city and
 * a generous ring of surrounding Bavaria, which keeps the route from doubling
 * as a free global routing proxy for anyone who finds it.
 */
const BOUNDS = { minLat: 47.6, maxLat: 48.7, minLng: 10.8, maxLng: 12.4 };

/** Matches MAX_STOPS (5) in lib/itinerary, plus the visitor's own position. */
const MAX_WAYPOINTS = 6;

/** ~1.1 m. Beyond this, precision only adds identifiability, not accuracy. */
const COORD_PRECISION = 5;

interface Waypoint {
  lat: number;
  lng: number;
}

function isValidWaypoint(value: unknown): value is Waypoint {
  if (typeof value !== "object" || value === null) return false;
  const { lat, lng } = value as Record<string, unknown>;
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  );
}

const inBounds = (point: Waypoint) =>
  point.lat >= BOUNDS.minLat &&
  point.lat <= BOUNDS.maxLat &&
  point.lng >= BOUNDS.minLng &&
  point.lng <= BOUNDS.maxLng;

const round = (value: number) => Number(value.toFixed(COORD_PRECISION));

/** GeoJSON is [lng, lat]; everything else in this app is [lat, lng]. */
type LngLat = [number, number];
const toLatLng = (pair: LngLat): [number, number] => [pair[1], pair[0]];

function jsonError(error: string, status: number) {
  return NextResponse.json(
    { error },
    // Nothing here is cacheable: the request body describes where someone is.
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

/** One upstream attempt, with its own timeout. */
async function callOsrm(coordinates: string) {
  const url =
    `${OSRM_ENDPOINT}/${coordinates}` +
    "?overview=full&geometries=geojson&steps=true&alternatives=false";

  const response = await fetch(url, {
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    // The upstream response depends entirely on the coordinates, which are
    // per-visitor. Nothing about it should land in a shared cache.
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error(`upstream ${response.status}`);
  return response.json();
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_body", 400);
  }

  const waypoints = (body as { waypoints?: unknown })?.waypoints;

  if (!Array.isArray(waypoints) || waypoints.length < 2) {
    return jsonError("invalid_waypoints", 400);
  }
  if (waypoints.length > MAX_WAYPOINTS) {
    return jsonError("too_many_waypoints", 400);
  }
  if (!waypoints.every(isValidWaypoint)) {
    return jsonError("invalid_waypoints", 400);
  }
  // Out-of-area is a distinct outcome, not a failure: the UI tells someone
  // routing only covers Munich rather than showing them a generic error.
  if (!waypoints.every(inBounds)) {
    return jsonError("out_of_area", 422);
  }

  const coordinates = waypoints.map((point) => `${round(point.lng)},${round(point.lat)}`).join(";");

  let data: {
    code?: string;
    routes?: {
      distance: number;
      duration: number;
      geometry?: { coordinates?: LngLat[] };
      legs?: {
        distance: number;
        duration: number;
        steps?: { geometry?: { coordinates?: LngLat[] } }[];
      }[];
    }[];
  };

  try {
    data = await callOsrm(coordinates);
  } catch {
    // One retry: the demo server's failures are typically transient, and a
    // silent second attempt beats making someone tap "Try again".
    try {
      data = await callOsrm(coordinates);
    } catch {
      // Deliberately not logging the error object — an upstream error can
      // echo the request URL back, and that URL contains the coordinates.
      return jsonError("upstream_unavailable", 503);
    }
  }

  const route = data.routes?.[0];
  const path = route?.geometry?.coordinates?.map(toLatLng);

  if (!path?.length) {
    return jsonError("no_route", 404);
  }

  /* Per-leg geometry, rebuilt from each leg's steps, so the map can label
     every hop of a planned trip at its own midpoint instead of guessing one
     from the straight line between stops. */
  const legs =
    route?.legs?.map((leg) => ({
      distanceKm: leg.distance / 1000,
      durationMin: leg.duration / 60,
      path: (leg.steps ?? []).flatMap((step) => step.geometry?.coordinates?.map(toLatLng) ?? []),
    })) ?? [];

  return NextResponse.json(
    {
      path,
      distanceKm: route!.distance / 1000,
      durationMin: route!.duration / 60,
      legs,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
