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
    sitemap: "https://atlas-munich.de/sitemap.xml",
    host: "https://atlas-munich.de",
  };
}
