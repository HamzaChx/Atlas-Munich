import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

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
      href: "/career",
      primary: false,
    },
  ];

  return (
    <section className="home-hero relative isolate -mt-(--header-h) overflow-hidden">
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-5 pb-32 pt-28 sm:px-8 sm:pb-28 sm:pt-32 lg:min-h-[100svh] lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:gap-16 lg:px-10 lg:pb-20 lg:pt-28 2xl:max-w-[96rem] 2xl:gap-24 2xl:px-12">
        <div className="min-w-0 lg:pb-4">
          <h1 className="rise rise-1 display-wide max-w-[14ch] font-display text-balance text-[clamp(2.75rem,10vw,4.5rem)] font-bold leading-[0.96] tracking-[-0.045em] text-zinc-950 dark:text-zinc-50 sm:text-[4.65rem] lg:text-[clamp(4.1rem,5.4vw,5.25rem)]">
            {t("heroTitle")}
            <span className="mt-2 block text-bloom">{t("heroTitleHighlight")}</span>
          </h1>

          <p className="rise rise-2 mt-7 max-w-xl text-pretty text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-xl sm:leading-relaxed">
            {t("heroSubtitle")}
          </p>

          <nav
            aria-label={t("quick.badge")}
            className="rise rise-3 mt-9 flex max-w-[38rem] flex-col gap-2.5 sm:flex-row sm:flex-wrap"
          >
            {quickAccess.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative isolate inline-flex min-h-13 items-center justify-between gap-5 overflow-hidden rounded-full border px-5 py-3 text-sm font-bold tracking-[-0.01em] backdrop-blur-xl transition-[background-color,border-color,box-shadow,transform] duration-200 before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-white/80 before:content-[''] hover:-translate-y-0.5 focus-visible:ring-offset-[#fbf6ec] dark:focus-visible:ring-offset-[#191816] sm:min-w-[10.5rem] ${
                  item.primary
                    ? "border-bloom/20 bg-white/[0.55] text-zinc-950 shadow-[0_10px_30px_rgba(93,57,33,0.11),inset_0_1px_0_rgba(255,255,255,0.8)] hover:border-bloom/35 hover:bg-white/[0.72] hover:shadow-[0_14px_34px_rgba(93,57,33,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-bloom/25 dark:bg-white/[0.09] dark:text-zinc-50 dark:shadow-[0_10px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.1)] dark:hover:bg-white/[0.14]"
                    : "border-white/70 bg-white/[0.32] text-zinc-700 shadow-[0_8px_24px_rgba(93,57,33,0.07),inset_0_1px_0_rgba(255,255,255,0.75)] hover:border-white hover:bg-white/[0.58] hover:text-zinc-950 hover:shadow-[0_12px_30px_rgba(93,57,33,0.11),inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-white/10 dark:bg-white/[0.055] dark:text-zinc-200 dark:shadow-[0_8px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.07)] dark:hover:border-white/[0.18] dark:hover:bg-white/[0.1] dark:hover:text-zinc-50"
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  className={`relative z-10 text-base font-medium transition-transform duration-200 group-hover:translate-x-0.5 ${
                    item.primary ? "text-bloom" : "text-zinc-400 dark:text-zinc-500"
                  }`}
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="hero-visual-in relative mx-auto w-full max-w-[30rem] lg:justify-self-end">
          <div
            className="absolute -inset-5 rounded-[3rem] bg-saffron/[0.09] dark:bg-saffron/[0.045]"
            aria-hidden="true"
          />

          <div className="relative mx-auto aspect-[825/1024] w-[min(82vw,24rem)] overflow-hidden rounded-[2.5rem] border-[6px] border-card bg-card shadow-[0_24px_70px_rgba(55,42,26,0.16)] ring-1 ring-border/60 sm:w-[25rem] lg:w-full lg:max-w-[27rem] dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <Image
              src="/hero.png"
              alt={t("heroImageAlt")}
              fill
              priority
              quality={90}
              sizes="(max-width: 639px) 82vw, (max-width: 1023px) 416px, 448px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
