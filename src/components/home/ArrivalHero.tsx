import Image from "next/image";
import { ArrowRight, Briefcase, MapPin, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export async function ArrivalHero() {
  const t = await getTranslations("home");

  const quickAccess = [
    {
      label: t("quick.ask"),
      href: "/chat",
      icon: MessageCircle,
      primary: true,
    },
    {
      label: t("quick.map"),
      href: "/map",
      icon: MapPin,
      primary: false,
    },
    {
      label: t("quick.career"),
      href: "/career",
      icon: Briefcase,
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
            className="rise rise-3 mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:flex sm:flex-wrap"
          >
            {quickAccess.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    item.primary
                      ? "group col-span-2 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-zinc-950 px-6 text-sm font-bold text-zinc-50 shadow-[0_10px_28px_rgba(32,29,24,0.16)] transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-[0_14px_34px_rgba(32,29,24,0.2)] dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 sm:col-span-1"
                      : "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-border/80 bg-card/70 px-4 text-sm font-semibold text-zinc-700 shadow-sm transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-card dark:text-zinc-200 dark:hover:border-zinc-600"
                  }
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  {item.label}
                  {item.primary && (
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
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
