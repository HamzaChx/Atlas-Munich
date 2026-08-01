import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Locale-aware replacements for `next/link` and `next/navigation`.
 *
 * Import `Link` from here rather than from `next/link` anywhere inside the
 * app: these prepend the active locale prefix, so an `href="/guides"` written
 * once resolves to /guides, /fr/guides or /de/guides depending on where the
 * reader already is. A plain `next/link` would silently drop them back to
 * English mid-journey.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
