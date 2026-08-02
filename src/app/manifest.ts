import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Atlas Munich",
    short_name: "Atlas",
    description:
      "The complete starter guide for Moroccan students and professionals in Munich.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    categories: ["education", "travel", "lifestyle"],
    icons: [
      // `any` icons are drawn full-bleed; `maskable` ones carry the 40% safe
      // zone Android crops against, so both purposes need their own file.
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcuts: [
      { name: "Map", short_name: "Map", url: "/map" },
      { name: "Guides", short_name: "Guides", url: "/guides" },
    ],
  };
}
