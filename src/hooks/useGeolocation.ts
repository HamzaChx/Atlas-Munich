"use client";

import { useCallback, useState } from "react";
import type { Coordinates } from "@/lib/geo";

export type GeolocationStatus =
  | "idle"
  | "locating"
  | "granted"
  | "denied"
  | "unavailable"
  | "timeout"
  | "error";

interface UseGeolocationResult {
  status: GeolocationStatus;
  coords: Coordinates | null;
  isSupported: boolean;
  /** Triggers the browser's native permission prompt. Never called automatically. */
  request: () => void;
  /** Drops the stored position and returns to "idle" — the user's opt-out. */
  clear: () => void;
}

/**
 * Thin wrapper around the browser Geolocation API.
 *
 * Privacy/GDPR notes:
 * - Nothing runs until `request()` is called explicitly by the user (no
 *   auto-prompt on mount), so consent is always a deliberate action.
 * - Coordinates live only in this hook's React state — never written to
 *   localStorage, cookies, or any server. They vanish on refresh or on
 *   `clear()`, so there is nothing to retain or delete later.
 * - `maximumAge` lets the browser reuse a very recent fix instead of
 *   re-prompting the OS layer, but nothing here caches it beyond that.
 */
export function useGeolocation(): UseGeolocationResult {
  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const [coords, setCoords] = useState<Coordinates | null>(null);

  const isSupported = typeof navigator !== "undefined" && "geolocation" in navigator;

  const request = useCallback(() => {
    if (!isSupported) {
      setStatus("unavailable");
      return;
    }

    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setStatus("granted");
      },
      (error) => {
        setCoords(null);
        /* Denial used to navigate to `app-settings:`, a scheme no browser
           handles, which on desktop threw the user off the page for nothing.
           The `errorDenied` copy already tells them where to re-enable it. */
        if (error.code === error.PERMISSION_DENIED) setStatus("denied");
        else if (error.code === error.TIMEOUT) setStatus("timeout");
        else setStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 5 * 60 * 1000 }
    );
  }, [isSupported]);

  const clear = useCallback(() => {
    setCoords(null);
    setStatus("idle");
  }, []);

  return { status, coords, isSupported, request, clear };
}
