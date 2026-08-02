import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ZelligeRosette } from "@/components/home";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HelpCircle, Users } from "lucide-react";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Required for static rendering: without it next-intl falls back to reading
  // the locale from headers, which opts this page back into rendering on demand.
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const quickAccess = [
    { label: t("quick.map"), href: "/map" },
    { label: t("quick.studies"), href: "/studies" },
    { label: t("quick.career"), href: "/career" },
  ];

  return (
    <div className="min-h-screen">
      {/* ========== HERO — one section now, not two ==========
          Used to be two stacked "heroes": title-subtitle-CTA over a photo,
          then a second section repeating that same shape over a mosaic
          background. Folded into one: the zellij rosettes and floating words
          frame the title exactly as they did in the old second section, then
          the photo runs the full width beneath as the hero's main visual,
          not a side column competing with the text for space. */}
      <section className="relative overflow-hidden">
        {/* Two rosettes, each continuing past the edge of the page */}
        <ZelligeRosette
          uid="zl"
          spin="420s"
          className="left-0 top-[30%] -translate-x-[46%] -translate-y-1/2 pointer-events-none"
          svgClassName="w-[70px] sm:w-[280px] lg:w-[400px] opacity-40 sm:opacity-100"
        />
        <ZelligeRosette
          uid="zr"
          spin="530s"
          reverse
          className="right-0 top-[46%] translate-x-[46%] -translate-y-1/2 pointer-events-none"
          svgClassName="w-[60px] sm:w-[250px] lg:w-[355px] opacity-40 sm:opacity-100"
        />

        {/* Floating words, the two homes drifting around the message */}
        <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
          <span
            dir="rtl"
            lang="ar"
            className="float-slow absolute left-[18%] top-[14%] hidden text-6xl font-bold text-bloom opacity-[0.25] lg:block xl:left-[20%] dark:opacity-[0.35]"
            style={{ "--tilt": "-6deg" } as React.CSSProperties}
          >
            مرحبا
          </span>
          <span
            className="float-slower absolute right-[17%] top-[10%] hidden font-display text-4xl font-extrabold text-zellige/30 lg:block xl:right-[19%]"
            style={{ "--tilt": "5deg" } as React.CSSProperties}
          >
            Servus!
          </span>
          <span
            className="float-slower absolute left-[20%] top-[46%] hidden font-display text-xl font-bold tracking-wide text-zinc-400/50 xl:block dark:text-zinc-500/50"
            style={{ "--tilt": "-4deg" } as React.CSSProperties}
          >
            München
          </span>
          <span
            dir="rtl"
            lang="ar"
            className="float-slow absolute right-[20%] top-[44%] hidden text-3xl font-semibold text-saffron opacity-[0.45] xl:block"
            style={{ "--tilt": "4deg" } as React.CSSProperties}
          >
            الأطلس
          </span>
        </div>

        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-5 pb-10 pt-24 text-center sm:pb-14 sm:pt-32 2xl:max-w-3xl">
          <h1 className="rise rise-1 font-display text-[2.6rem] font-bold leading-[1.06] tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl 2xl:text-7xl">
            {t("heroTitle")}
            <span className="block pb-1 text-bloom">{t("heroTitleHighlight")}</span>
          </h1>

          <p className="rise rise-2 mx-auto mt-5 max-w-lg text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg 2xl:text-xl">
            {t("heroSubtitle")}
          </p>

          <div className="rise rise-3 mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
              {t("quick.badge")}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2.5">
              {quickAccess.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zellige focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* The photo: the hero's main visual, full width and uncropped in
            proportion (the source is a 2.36:1 panorama with people standing
            along both edges, so a tighter crop would cut the group rather
            than just the background). Contained to max-w-6xl rather than the
            viewport edge because upscaling a 1024px-wide source past that
            softens it. */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
          <div className="rise rise-4 relative aspect-[5/4] w-full overflow-hidden rounded-[1.75rem] shadow-[0_12px_40px_rgb(0_0_0/0.12)] sm:aspect-[1024/434] dark:shadow-none dark:ring-1 dark:ring-border">
            <Image
              src="/atlas-hero.jpeg"
              alt={t("heroImageAlt")}
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* ========== COMMUNITY ========== */}
      <section className="relative py-16 sm:py-24 2xl:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 2xl:max-w-[96rem] 2xl:px-12">
          <div className="reveal grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 2xl:gap-16">
            <div className="lg:col-span-7">
              <span className="eyebrow">{t("community.badge")}</span>
              <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl 2xl:text-4xl">
                {t("community.title")}
                <span className="text-bloom">{t("community.titleHighlight")}</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-[15px]">
                {t("community.description1")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-[15px]">
                {t("community.description2")}{" "}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {t("community.atlasName")}
                </span>
                {t("community.description3")}
              </p>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <Button
                  asChild
                  className="rounded-full bg-zinc-900 px-6 text-white shadow-md shadow-zinc-900/15 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
                >
                  <Link href="/about">
                    <Users className="mr-2 h-4 w-4" />
                    {t("community.aboutCommunity")}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full px-6 text-zinc-600 hover:bg-card hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50"
                >
                  <Link href="/community">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    {t("community.commonQuestions")}
                  </Link>
                </Button>
              </div>
            </div>

            {/* The greeting, back beside the community copy. It stacks under
                the text on small screens rather than disappearing, which is
                what the old `hidden lg:flex` did to every phone. */}
            <div className="flex flex-col items-center text-center lg:col-span-5">
              <p
                dir="rtl"
                lang="ar"
                className="float-slower text-5xl font-bold leading-snug text-bloom lg:text-6xl"
              >
                مرحبا بيك
              </p>
              <p className="mt-5 text-sm text-zinc-400 dark:text-zinc-500">
                {t("byTheCommunity")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
