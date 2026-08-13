/// <reference lib="webworker" />

// ============================================
// Atlas Munich – service worker
//
// The point of this file is the KVR waiting room: someone who landed in
// Munich last week, has no SIM yet, and needs the Anmeldung guide on a phone
// with no connection. So the guides, the places directory and the map tiles
// they have already seen all have to survive going offline.
//
// Built by `serwist build` (see serwist.config.js) rather than by Next, since
// Turbopack doesn't run the webpack-based plugin. Excluded from the app
// tsconfig because it targets `webworker`, not `dom`.
// ============================================

import { defaultCache, PAGES_CACHE_NAME } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, ExpirationPlugin, NetworkOnly, Serwist, StaleWhileRevalidate } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // Chat is a streamed LLM response. A replayed answer to a different
      // question is worse than an honest failure, so it never touches a cache.
      matcher: ({ url }) => url.pathname.startsWith("/api/"),
      handler: new NetworkOnly(),
    },
    {
      // Leaflet basemap tiles. Caching them is what makes the places map
      // usable offline rather than an empty grey grid.
      matcher: ({ url }) => url.hostname.endsWith("basemaps.cartocdn.com"),
      handler: new CacheFirst({
        cacheName: "map-tiles",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 400,
            maxAgeSeconds: 30 * 24 * 60 * 60,
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
    {
      /* Every page navigation, not just guides: pages are no longer precached
         (three locales of everything came to 10 MB), so this is what makes a
         page the reader has already opened survive going offline. Content
         changes on our schedule rather than theirs, so the stored copy is
         served instantly and refreshed in the background. */
      matcher: ({ request, url }) =>
        request.mode === "navigate" && url.origin === self.location.origin,
      handler: new StaleWhileRevalidate({
        cacheName: PAGES_CACHE_NAME.html,
        plugins: [
          // Generous, because the entries are one locale's pages only — the
          // ones this reader actually visited.
          new ExpirationPlugin({ maxEntries: 96, maxAgeSeconds: 7 * 24 * 60 * 60 }),
        ],
      }),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        /* A static file rather than an app route. The fallback has to be one
           precached URL, but the app now has three locales — this single 2 KB
           page carries all three and picks between them from the locale
           cookie, which is cheaper than precaching three real pages. */
        url: "/offline.html",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

serwist.addEventListeners();
