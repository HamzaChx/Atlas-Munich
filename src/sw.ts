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
import {
  CacheFirst,
  ExpirationPlugin,
  NetworkOnly,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";

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
      // Guides and places change on our schedule, not the reader's: serve the
      // stored copy instantly and refresh it in the background.
      matcher: ({ request, url }) =>
        request.mode === "navigate" &&
        (url.pathname.startsWith("/guides") ||
          url.pathname.startsWith("/places") ||
          url.pathname.startsWith("/category")),
      handler: new StaleWhileRevalidate({
        cacheName: PAGES_CACHE_NAME.html,
        plugins: [
          new ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 7 * 24 * 60 * 60 }),
        ],
      }),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        // A static file, not an app route: this app renders every route on
        // demand (the locale is a cookie read in the root layout), so no page
        // HTML is prerendered and none of it can be precached.
        url: "/offline.html",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

serwist.addEventListeners();
