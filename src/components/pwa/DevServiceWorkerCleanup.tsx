"use client";

import * as React from "react";

/* SerwistProvider only registers in production, but a service worker
   registered by an earlier `npm start` test lingers on localhost regardless
   of what's now running behind it, and its stale-while-revalidate cache
   makes dev edits appear to revert on reload. Dev builds actively unregister
   and clear that leftover instead of requiring a manual DevTools cleanup. */
export function DevServiceWorkerCleanup() {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });

    if ("caches" in window) {
      caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
    }
  }, []);

  return null;
}
