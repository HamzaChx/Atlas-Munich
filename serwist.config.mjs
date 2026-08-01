// Serwist runs as a separate build step (see the `build` script) rather than
// as a Next plugin, because the plugin is webpack-only and this app builds
// with Turbopack. `serwist()` supplies the Next-aware defaults: the precache
// glob patterns over .next/static and public/, and the URL rewriting that maps
// build output paths back to the routes the browser actually requests.
import { serwist } from "@serwist/next/config";

export default await serwist({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",

  /* Now that every page prerenders, the default would precache all three
     locales of all ~25 routes — 10 MB of HTML pushed on install, most of it in
     languages the reader doesn't speak. The app shell (JS/CSS/icons) is
     precached instead, and pages are cached as they are actually visited by
     the navigation rule in src/sw.ts. */
  precachePrerendered: false,

  globIgnores: [
    // Every <Image> in the app is served through /_next/image, so the raw
    // files in public/ are never what the browser actually requests —
    // precaching them costs a megabyte on mobile data and caches nothing the
    // page will use. The optimized variants are picked up at runtime instead
    // (see the /_next/image rule in defaultCache). The exceptions kept below
    // are the manifest icons and the offline fallback, which are requested by
    // their real paths.
    "public/*.jpeg",
    "public/*.webp",
    "public/atlas.png",
    "public/logo.png",
  ],
});
