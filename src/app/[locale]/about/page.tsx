import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  ContributorCard,
  OpenContributorCard,
  type Contributor,
} from "@/components/about/ContributorCards";
import { ZelligeRosette } from "@/components/home";
import { alternatesFor, localizedUrl } from "@/lib/urls";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeartHandshake, Mail } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

/* Was a static English object, so /fr/about and /de/about both advertised an
   English title and description to crawlers and link previews. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: `${t("title")} ${t("titleHighlight")}`,
    description: t("subtitle"),
    alternates: alternatesFor(locale, "/about"),
    openGraph: {
      title: `${t("title")} ${t("titleHighlight")}`,
      description: t("subtitle"),
      type: "website",
      url: localizedUrl(locale, "/about"),
    },
  };
}

const contributors: Contributor[] = [
  {
    name: "Hamza Chaouki",
    role: "Founder & Developer",
    photo: "/hamzafounder.png",
    url: "https://hamzachaouki.com/",
    focalY: 55,
    tint: "bg-tint-terra",
    photoAccent: "text-[oklch(0.86_0.1_50)]",
  },
  {
    name: "Mohamed Nejjar",
    role: "Founder & AI Specialist",
    photo: "/mohamedfounder.png",
    url: "https://mohamednejjar.com/",
    tint: "bg-tint-blue",
    photoAccent: "text-[oklch(0.86_0.085_250)]",
  },
];

export default async function AboutPage({ params }: PageProps) {
  // Required for static rendering: without it next-intl falls back to reading
  // the locale from headers, which opts this page back into rendering on demand.
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const manifesto = [
    t("manifesto.items.practical"),
    t("manifesto.items.studentAware"),
    t("manifesto.items.openSource"),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ========== HERO ========== */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-14 pt-14 text-center sm:pb-20 sm:pt-20 2xl:max-w-3xl">
        <span className="rise rise-1 eyebrow">{t("badge")}</span>

        <h1 className="rise rise-2 font-display mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl 2xl:text-6xl">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>

        <p className="rise rise-3 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg 2xl:max-w-lg 2xl:text-xl">
          {t("subtitle")}
        </p>

        <div className="rise rise-4 mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            className="rounded-full bg-zinc-900 px-6 text-white shadow-md shadow-zinc-900/15 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
          >
            {/* Contributing and getting in touch now live on the Community
                hub, so this page can stay one thing: who we are. */}
            <Link href="/community#contribute">
              <HeartHandshake className="mr-2 h-4 w-4" />
              {t("howToContribute")}
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="rounded-full px-6 text-zinc-600 hover:bg-card hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50"
          >
            <Link href="/community#contact">
              <Mail className="mr-2 h-4 w-4" />
              {t("getInTouch")}
            </Link>
          </Button>
        </div>
      </section>

      <div className="mx-auto max-w-6xl 2xl:max-w-[96rem] px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8 2xl:px-12">
        {/* ========== STORY: one column, read top to bottom, with the
            rosette standing in the empty width beside it on wide screens ========== */}
        <section className="reveal mb-16 sm:mb-24 lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="max-w-2xl lg:col-span-7">
            <span className="eyebrow">{t("story.badge")}</span>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl 2xl:text-4xl">
              {t("story.title")}
            </h2>

            <p className="mt-3 text-sm font-medium text-zinc-400 dark:text-zinc-500">
              {manifesto.join("  ·  ")}
            </p>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
              <p>{t("story.p1")}</p>
              <p>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {t("story.p2Start")}
                </span>
                {t("story.p2End")}
              </p>
              <p>{t("story.p3")}</p>
            </div>
          </div>

          <div className="relative col-span-5 hidden lg:block">
            <ZelligeRosette
              uid="story"
              spin="480s"
              className="top-1/2 right-[-9rem] -translate-y-1/2"
              svgClassName="h-[34rem] w-[34rem]"
            />
          </div>
        </section>

        {/* ========== THE TEAM ========== */}
        <section className="reveal">
          <span className="eyebrow">{t("contributors.badge")}</span>
          <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {t("contributors.title")}
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
            {contributors.map((contributor) => (
              <ContributorCard key={contributor.name} {...contributor} />
            ))}
            <OpenContributorCard
              youLabel={t("contributors.you")}
              joinLabel={t("contributors.joinTeam")}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
