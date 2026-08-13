import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingMasonrySection } from "@/components/home";
import ScrollExpand from "@/components/ui/scroll-expand";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  // Required for static rendering: without it next-intl falls back to reading
  // the locale from headers, which opts this page back into rendering on demand.
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const quickAccess = [
    { label: t("quick.map"), href: "/map" },
    { label: t("quick.essentials"), href: "/essentials" },
    { label: t("quick.career"), href: "/career" },
  ];

  return (
    <div className="min-h-screen">
      {/* ========== HERO ==========*/}
      {/* `main` carries a global `pt-(--header-h)` so sticky offsets on every
          other page line up under the bar; that same padding would leave
          this hero's photo starting below the header instead of behind it.
          Pulling the section up by that exact height (and no more, so nothing
          else on the page shifts) is the fix, not touching the shared spacer.
          The full message is passed as `staticOverlay` rather than `title`
          (fades out) or `children` (fades in near full expansion): it's
          meant to be completely visible from the first paint, unclipped by
          the small resting frame, while the photo itself still does its own
          scroll-driven expand from thumbnail to full-bleed underneath it. */}
      <ScrollExpand
        src="/hero.webp"
        alt={t("heroTitle")}
        scrollHint={t("heroScrollHint")}
        overlayScrim={0.6}
        useWindowScroll
        className="relative isolate -mt-(--header-h)"
        staticOverlay={
          <div className="flex flex-col items-center rounded-[2rem] bg-black/35 px-6 py-10 backdrop-blur-sm sm:px-12 sm:py-12">
            <h1 className="display-wide font-display text-balance text-center text-[2.75rem] font-bold leading-[0.98] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl">
              {t("heroTitle")}
              <span className="block pb-1 text-[oklch(0.74_0.14_45)]">
                {t("heroTitleHighlight")}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-balance text-center text-lg leading-relaxed text-white/90 sm:text-xl">
              {t("heroSubtitle")}
            </p>

            <p className="mt-8 text-balance text-center text-lg font-semibold text-white sm:text-xl">
              {t("quick.badge")}
            </p>

            {/* Solid-white + ghost-on-glass pairing: the dark ink pill from the
                old light hero would disappear against this photo, so the
                primary CTA flips to a light pill and the secondary one becomes
                an outlined glass button instead. */}
            <div className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {quickAccess.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 focus-visible:ring-white ${
                    idx === 0
                      ? "bg-white text-zinc-900 shadow-md shadow-black/20 hover:bg-zinc-100"
                      : "border border-white/30 text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        }
      />

      {/* ========== CATEGORIES + FEATURED GUIDES (Replaced with Masonry Section) ========== */}
      <LandingMasonrySection />
    </div>
  );
}
