import { ImageResponse } from "next/og";
import { getGuideBySlug } from "@/data/guides";
import { getCategoryByKey } from "@/data/categories";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Flat, brand-matching hex approximations of the site's oklch tokens — the
 * satori renderer behind ImageResponse doesn't reliably resolve CSS vars or
 * oklch(), so colors are hardcoded here rather than imported. */
const PALETTE: Record<string, { acc: string; tint: string }> = {
  "rent-housing": { acc: "#b85c38", tint: "#f7e9df" },
  "kvr-residence": { acc: "#3c5a80", tint: "#e7edf5" },
  "university-life": { acc: "#3e7a56", tint: "#e6f2ea" },
  career: { acc: "#7c4569", tint: "#f5e9f0" },
  "useful-apps": { acc: "#c08a2e", tint: "#fbf1de" },
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  const category = guide ? getCategoryByKey(guide.categoryKey) : undefined;
  const palette = PALETTE[guide?.categoryKey ?? ""] ?? PALETTE["rent-housing"];
  const title = guide?.title ?? "Atlas Munich";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#faf9f5",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            backgroundColor: palette.acc,
            display: "flex",
          }}
        />
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#6b6b66",
          }}
        >
          {category?.title ?? "Guide"}
        </span>
      </div>

      <div style={{ display: "flex" }}>
        <span
          style={{
            fontSize: title.length > 46 ? 56 : 68,
            fontWeight: 800,
            lineHeight: 1.15,
            color: "#1c1c1a",
            maxWidth: 1000,
          }}
        >
          {title}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            borderRadius: 999,
            backgroundColor: palette.tint,
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 700, color: palette.acc }}>
            {guide?.readingTime ? `${guide.readingTime} min read` : "Guide"}
          </span>
        </div>
        <span style={{ fontSize: 26, fontWeight: 800, color: "#1c1c1a" }}>Atlas Munich</span>
      </div>
    </div>,
    { ...size }
  );
}
