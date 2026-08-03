"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Coordinates } from "@/lib/geo";
import { fetchRoadRoute, RouteError, type RoadRoute, type RouteErrorReason } from "@/lib/routing";

interface RouteOutcome {
  /** The waypoints and attempt this outcome belongs to, so a stale or
      previously-failed one is recognisable and never shown as current. */
  signature: string;
  attempt: number;
  route: RoadRoute | null;
  error: RouteErrorReason | null;
}

/**
 * Keeps a street-following route in sync with a list of waypoints — the
 * planned trip, which grows and shrinks as stops are added and removed.
 *
 * Only the settled outcome is stored. "Loading" is derived from the stored
 * outcome not matching the waypoints (and attempt) currently asked for,
 * which keeps the effect free of synchronous state writes and means a
 * superseded request can never leave the hook reporting the wrong thing.
 *
 * Waypoints are compared by coordinate, not by array identity, so passing a
 * fresh array literal on every render is safe.
 */
export function useRoadRoute(waypoints: Coordinates[] | null) {
  const [outcome, setOutcome] = useState<RouteOutcome | null>(null);
  const [attempt, setAttempt] = useState(0);
  const requestRef = useRef<AbortController | null>(null);

  const signature =
    waypoints && waypoints.length >= 2
      ? waypoints.map((point) => `${point.lat.toFixed(5)},${point.lng.toFixed(5)}`).join(";")
      : "";

  useEffect(() => {
    requestRef.current?.abort();
    if (!signature) return;

    const points: Coordinates[] = signature.split(";").map((pair) => {
      const [lat, lng] = pair.split(",").map(Number);
      return { lat, lng };
    });

    const controller = new AbortController();
    requestRef.current = controller;

    fetchRoadRoute(points, controller.signal)
      .then((route) => {
        if (!controller.signal.aborted) setOutcome({ signature, attempt, route, error: null });
      })
      .catch((error) => {
        // The trip caller falls back to straight lines, so a failure here is
        // a downgrade in fidelity rather than a dead end worth shouting about.
        if (controller.signal.aborted) return;
        const reason = error instanceof RouteError ? error.reason : "unavailable";
        setOutcome({ signature, attempt, route: null, error: reason });
      });

    return () => controller.abort();
  }, [signature, attempt]);

  /** Re-runs the fetch for the current waypoints, even if they have not
      changed — the only way a failed attempt can be asked to try again. */
  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  if (!signature) return { route: null, status: "idle" as const, error: null, retry };
  if (outcome?.signature !== signature || outcome.attempt !== attempt) {
    return { route: null, status: "loading" as const, error: null, retry };
  }
  return {
    route: outcome.route,
    status: outcome.error ? ("error" as const) : ("idle" as const),
    error: outcome.error,
    retry,
  };
}
