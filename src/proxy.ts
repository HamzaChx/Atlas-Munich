import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { routing } from "@/i18n/routing";

/**
 * Locale routing, at the edge. Resolves which of /, /fr/... or /de/... a
 * request belongs to, and redirects /en/... to the unprefixed form so no page
 * is reachable at two addresses.
 *
 * Replaces the previous hand-rolled cookie reader, which set a request header
 * that `src/i18n/request.ts` then read via `headers()` — the single reason no
 * page in this app could ever be statically prerendered.
 */
const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  /* next-intl doesn't set this itself. Without it, the 307 that sends a
     French browser from / to /fr is an ordinary cacheable redirect keyed only
     on the URL: one shared cache node could pin every later visitor to /, a
     crawler included, onto whichever language happened to ask first. */
  response.headers.append("Vary", "Accept-Language");

  return response;
}

export const config = {
  // Everything except API routes, Next internals, the service worker, and any
  // path with a file extension (static assets in public/).
  matcher: ["/((?!api|_next|sw\\.js|.*\\..*).*)"],
};
