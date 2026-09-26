import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { HeroStage } from "./HeroStage";

export async function ArrivalHero() {
  const t = await getTranslations("home");

  const quickAccess = [
    {
      label: t("quick.ask"),
      href: "/chat",
      primary: true,
    },
    {
      label: t("quick.map"),
      href: "/map",
      primary: false,
    },
    {
      label: t("quick.career"),
      // Straight to the work guide inside Lifestyle; the explorer reads the hash.
      href: "/lifestyle#find-werkstudent-job",
      primary: false,
    },
  ];

  return (
    /* -mt cancels the global `main` padding so the film reaches up behind the
       transparent header and fills the viewport edge to edge. */
    <section className="relative -mt-(--header-h)">
      <HeroStage
        caption={
          <>
            <span lang="de">Servus</span>
            <span className="mx-2 opacity-50" aria-hidden="true">·</span>
            <span lang="ar" dir="rtl">مرحبا</span>
          </>
        }
        playLabel={t("heroVideo.play")}
        pauseLabel={t("heroVideo.pause")}
      >
        {/* A title card rather than a billboard: semibold instead of bold,
            sized to sit in the lower third and leave the room visible. */}
        <h1 className="rise rise-1 display-wide max-w-[17ch] font-display text-balance text-[clamp(2.5rem,9.5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-hero-cream sm:text-[4.25rem] lg:text-[clamp(4rem,5.2vw,5.5rem)]">
          {t("heroTitle")}
          <span className="block text-hero-gold">{t("heroTitleHighlight")}</span>
        </h1>

        <p className="rise rise-2 mt-6 max-w-[34rem] text-pretty text-base leading-relaxed text-hero-cream sm:mt-7 sm:text-lg sm:leading-relaxed">
          {t("heroSubtitle")}
        </p>

        <nav
          aria-label={t("quick.badge")}
          className="rise rise-3 mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 sm:mt-10"
        >
          {quickAccess.map((item) =>
            item.primary ? (
              <Link
                key={item.href}
                href={item.href}
                className="group inline-flex min-h-13 w-full items-center justify-between gap-6 rounded-full bg-hero-cream px-6 py-3 text-sm font-bold sm:w-auto tracking-[-0.01em] text-hero-ink shadow-[0_12px_32px_rgb(20_10_4/0.35)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-hero-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-gold focus-visible:ring-offset-2 focus-visible:ring-offset-hero-ink"
              >
                <span>{item.label}</span>
                <span className="text-base transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                  →
                </span>
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="group inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-hero-cream transition-colors duration-200 hover:text-hero-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-gold focus-visible:ring-offset-4 focus-visible:ring-offset-hero-ink"
              >
                <span className="underline decoration-current/35 decoration-1 underline-offset-[6px] group-hover:decoration-current">
                  {item.label}
                </span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                  →
                </span>
              </Link>
            )
          )}
        </nav>
      </HeroStage>
    </section>
  );
}
