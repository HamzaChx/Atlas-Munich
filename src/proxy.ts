import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

/**
 * Locale routing, at the edge. Resolves which of /, /fr/... or /de/... a
 * request belongs to, redirects /en/... to the unprefixed form, and sets
 * `Vary: Accept-Language` so caches don't serve one locale's HTML to another.
 *
 * Replaces the previous hand-rolled cookie reader, which set a request header
 * that `src/i18n/request.ts` then read via `headers()` — the single reason no
 * page in this app could ever be statically prerendered.
 */
export const proxy = createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals, the service worker, and any
  // path with a file extension (static assets in public/).
  matcher: ["/((?!api|_next|sw\\.js|.*\\..*).*)"],
};
