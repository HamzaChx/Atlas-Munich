import { ImageResponse } from "next/og";
import { getCategoryByKey } from "@/data/categories";
import { getGuidesByCategory } from "@/data/guides";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Flat, brand-matching hex approximations of the site's oklch tokens — see
 * guides/[slug]/opengraph-image.tsx for why these aren't CSS vars. */
const PALETTE: Record<string, { acc: string; tint: string }> = {
  "rent-housing": { acc: "#b85c38", tint: "#f7e9df" },
  "kvr-residence": { acc: "#3c5a80", tint: "#e7edf5" },
  "university-life": { acc: "#3e7a56", tint: "#e6f2ea" },
  career: { acc: "#7c4569", tint: "#f5e9f0" },
  "useful-apps": { acc: "#c08a2e", tint: "#fbf1de" },
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryByKey(slug);
  const palette = PALETTE[slug] ?? PALETTE["rent-housing"];
  const title = category?.title ?? "Atlas Munich";
  const guideCount = category ? getGuidesByCategory(category.key).length : 0;

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
      <span
        style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#6b6b66",
        }}
      >
        Atlas Munich Category
      </span>

      <div style={{ display: "flex" }}>
        <span
          style={{
            fontSize: 68,
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
            {guideCount} {guideCount === 1 ? "guide" : "guides"}
          </span>
        </div>
        <span style={{ fontSize: 26, fontWeight: 800, color: "#1c1c1a" }}>Atlas Munich</span>
      </div>
    </div>,
    { ...size }
  );
}
