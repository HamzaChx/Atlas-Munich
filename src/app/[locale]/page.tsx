import { setRequestLocale } from "next-intl/server";
import { ArrivalHero, LandingMasonrySection } from "@/components/home";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  // Required for static rendering: without it next-intl falls back to reading
  // the locale from headers, which opts this page back into rendering on demand.
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen">
      <ArrivalHero />

      {/* ========== CATEGORIES + FEATURED GUIDES (Replaced with Masonry Section) ========== */}
      <LandingMasonrySection />
    </div>
  );
}
