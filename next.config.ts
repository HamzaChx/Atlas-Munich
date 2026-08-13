import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * URLs that moved when the directory nav became a journey.
 *
 * These live in `redirects()` rather than in proxy.ts because config redirects
 * run BEFORE next-intl's middleware, at the platform's routing layer, without
 * invoking a function. The consequence is that the locale prefix is still on
 * the path and next-intl has not touched it yet, so a bare `source: "/places"`
 * would never match `/fr/places`. Each prefix has to be enumerated.
 *
 * `en` is folded straight to the unprefixed target instead of being left to
 * next-intl's own /en -> / hop, which would cost a second round trip.
 *
 * Shipping as 307/308-temporary first. Flip `permanent` to true once the
 * destinations have been verified in a real deployment, since a 308 is cached
 * by browsers more or less forever.
 */
const PERMANENT_MOVES = false;

function moved(from: string, to: string) {
  return [
    { source: `/:locale(fr|de)${from}`, destination: `/:locale${to}`, permanent: PERMANENT_MOVES },
    { source: `/en${from}`, destination: to, permanent: PERMANENT_MOVES },
    { source: from, destination: to, permanent: PERMANENT_MOVES },
  ];
}

// Map tiles (Leaflet, /map) are the only third-party images loaded
// client-side outside of Next's own image optimizer; the WhatsApp QR code
// goes through /_next/image, so it doesn't need its own img-src entry.
// Vercel Analytics/Speed Insights load and beacon through same-origin
// /_vercel/* paths, so 'self' already covers them — no extra connect-src host needed.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.basemaps.cartocdn.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  outputFileTracingRoot: process.cwd(),
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 85, 90, 95, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        pathname: "/v1/create-qr-code/**",
      },
    ],
  },
  async redirects() {
    return [
      ...moved("/places", "/map"),
      /* The five thin /category pages fold into the hub that now owns them.
         Google will canonicalize these to the hub itself, which is the point:
         five pages listing one to three guides each become two real ones. */
      ...moved("/category/rent-housing", "/map"),
      ...moved("/category/kvr-residence", "/essentials"),
      ...moved("/category/university-life", "/essentials"),
      ...moved("/category/career", "/career"),
      ...moved("/category/useful-apps", "/career"),
      // Anything else under /category, including keys added later, lands on the
      // full index rather than a 404. Must stay last.
      ...moved("/category/:slug*", "/guides"),
      // Studies was renamed to Essentials to broaden it beyond a student-only
      // audience; the content and route ownership are otherwise unchanged.
      ...moved("/studies", "/essentials"),
    ];
  },
  async headers() {
    return [
      {
        // Applies to every response, including API routes.
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Immutable cache for hashed static assets (_next/static)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Long-lived cache for public images/fonts
        source: "/:path(.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff2?|ttf|otf))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
