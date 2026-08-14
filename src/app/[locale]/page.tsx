import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingMasonrySection } from "@/components/home";

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
          else on the page shifts) is the fix, not touching the shared spacer. */}
      <section className="relative isolate -mt-(--header-h) flex min-h-[78vh] w-full flex-col justify-center overflow-hidden sm:min-h-screen">
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-5 pt-32 pb-16 text-center sm:px-6 sm:pt-40 sm:pb-24 lg:px-8 lg:pt-44">
          <h1 className="rise rise-1 display-wide font-display text-balance text-[2.75rem] font-bold leading-[0.98] tracking-[-0.02em] text-zinc-950 sm:text-6xl lg:text-7xl">
            {t("heroTitle")}
            <span className="block pb-1 text-[oklch(0.54_0.19_25)]">{t("heroTitleHighlight")}</span>
          </h1>

          <p className="rise rise-2 mx-auto mt-6 max-w-lg text-balance text-lg leading-relaxed text-zinc-700 sm:text-xl">
            {t("heroSubtitle")}
          </p>

          <span className="rise rise-3 mt-12 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900/70">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[oklch(0.54_0.19_25)]"
              aria-hidden="true"
            />
            {t("quick.badge")}
          </span>

          {/* Dark ink pill + ghost pairing, fixed rather than theme-reactive,
              because the hero background is always light regardless of
              which theme the reader is on. */}
          <div className="rise rise-4 mt-5 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {quickAccess.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-zinc-900 ${
                  idx === 0
                    ? "bg-zinc-900 text-zinc-50 shadow-md shadow-zinc-900/15 hover:bg-zinc-800"
                    : "text-zinc-700 hover:bg-zinc-900/5 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES + FEATURED GUIDES (Replaced with Masonry Section) ========== */}
      <LandingMasonrySection />
    </div>
  );
}
