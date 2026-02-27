import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Internal API routes — never index
          "/api/",
          // Chatbot UI pages — no standalone SEO value
          "/housing/chat",
          "/bureaucracy/chat",
          "/academic/chat",
          "/healthcare/chat",
        ],
      },
    ],
    sitemap: "https://atlasmunich.de/sitemap.xml",
    host: "https://atlasmunich.de",
  };
}
