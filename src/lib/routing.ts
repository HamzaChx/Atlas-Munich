// ============================================
// Atlas Munich – street-following routes for the places map
//
// Every distance elsewhere in the app (see geo.ts) is straight-line and
// computed in the browser against coordinates that already ship in the page.
// Drawing a route that follows actual roads cannot be done locally, so this
// is the one path that leaves the device — and only ever after someone taps
// "Directions", never on selection, never on load.
//
// It posts to our own /api/directions rather than to a routing service
// directly: the request body keeps coordinates out of URLs and logs, and the
// routing service never sees the visitor's IP address. See the route handler
// for the full reasoning.
// ============================================

import type { Coordinates } from "./geo";

export interface RouteLeg {
  distanceKm: number;
  durationMin: number;
  /** Geometry for this hop alone, so it can carry its own label. */
  path: [number, number][];
}

export interface RoadRoute {
  /** Ordered [lat, lng] pairs tracing the actual street network. */
  path: [number, number][];
  distanceKm: number;
  durationMin: number;
  legs: RouteLeg[];
}

/** Why a route could not be drawn, in the terms the UI needs to explain it. */
export type RouteErrorReason = "out_of_area" | "no_route" | "unavailable";

export class RouteError extends Error {
  reason: RouteErrorReason;
  constructor(reason: RouteErrorReason) {
    super(reason);
    this.name = "RouteError";
    this.reason = reason;
  }
}

/** Maps the handler's error codes onto the three cases worth distinguishing. */
function reasonFor(status: number, code: string | undefined): RouteErrorReason {
  if (status === 422 || code === "out_of_area") return "out_of_area";
  if (status === 404 || code === "no_route") return "no_route";
  return "unavailable";
}

/**
 * The shortest driving route through the given waypoints, following real
 * roads. Throws `RouteError` on any failure so the caller can tell "you are
 * outside Munich" apart from "the routing service is down".
 */
export async function fetchRoadRoute(
  waypoints: Coordinates[],
  signal?: AbortSignal
): Promise<RoadRoute> {
  if (waypoints.length < 2) throw new RouteError("no_route");

  let response: Response;
  try {
    response = await fetch("/api/directions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ waypoints }),
      signal,
    });
  } catch (error) {
    // An aborted request is a superseded one, not a failure to report.
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new RouteError("unavailable");
  }

  if (!response.ok) {
    const code = await response
      .json()
      .then((body) => body?.error as string | undefined)
      .catch(() => undefined);
    throw new RouteError(reasonFor(response.status, code));
  }

  const data = (await response.json()) as RoadRoute;
  if (!data?.path?.length) throw new RouteError("no_route");
  return data;
}
