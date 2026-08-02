import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { alternatesFor, localizedUrl } from "@/lib/urls";

import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  HeartHandshake,
  GithubIcon,
  Mail,
  ExternalLink,
  Plus,
  ListChecks,
  GraduationCap,
} from "lucide-react";

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

const contributors = [
  {
    name: "Hamza Chaouki",
    role: "Founder & Developer",
    initials: "HC",
    url: "https://hamzachaouki.vercel.app/",
    tint: "bg-tint-terra",
    text: "text-acc-terra",
  },
  {
    name: "Mohamed Nejjar",
    role: "Our AI Specialist",
    initials: "MN",
    url: "https://mohamed-nejjar.vercel.app/",
    tint: "bg-tint-blue",
    text: "text-acc-blue",
  },
];

export default async function AboutPage({ params }: PageProps) {
  // Required for static rendering: without it next-intl falls back to reading
  // the locale from headers, which opts this page back into rendering on demand.
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const manifesto = [
    {
      icon: ListChecks,
      tint: "bg-tint-terra",
      text: "text-acc-terra",
      title: t("manifesto.items.practical"),
      description: t("manifesto.items.practicalDesc"),
    },
    {
      icon: GraduationCap,
      tint: "bg-tint-blue",
      text: "text-acc-blue",
      title: t("manifesto.items.studentAware"),
      description: t("manifesto.items.studentAwareDesc"),
    },
    {
      icon: GithubIcon,
      tint: "bg-tint-green",
      text: "text-acc-green",
      title: t("manifesto.items.openSource"),
      description: t("manifesto.items.openSourceDesc"),
    },
  ];


  return (
    <div className="min-h-screen bg-background">
      {/* ========== HERO ========== */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-14 pt-14 text-center sm:pb-20 sm:pt-20 2xl:max-w-3xl">
        <h1 className="rise rise-1 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl 2xl:text-6xl">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>

        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg 2xl:max-w-lg 2xl:text-xl">
          {t("subtitle")}
        </p>

        <div className="rise rise-3 mt-8 flex flex-col items-center gap-3 sm:flex-row">
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
        {/* ========== STORY: editorial spread with the manifesto beside it ========== */}
        <section className="reveal mb-16 sm:mb-24 lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <span className="eyebrow">{t("story.badge")}</span>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl 2xl:text-4xl">
              {t("story.title")}
            </h2>

            <ul className="mt-8 space-y-4">
              {manifesto.map((item) => (
                <li key={item.title} className="flex items-start gap-3.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.tint}`}
                  >
                    <item.icon className={`h-4 w-4 ${item.text}`} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {item.title}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 space-y-4 text-base leading-relaxed text-zinc-600 lg:col-span-7 lg:mt-0 dark:text-zinc-400">
            <p>{t("story.p1")}</p>
            <p>
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                {t("story.p2Start")}
              </span>
              {t("story.p2End")}
            </p>
            <p>{t("story.p3")}</p>
          </div>
        </section>

        {/* ========== THE TEAM ========== */}
        <section className="reveal">
          <div className="rounded-3xl bg-card p-6 shadow-[0_2px_20px_rgb(0_0_0/0.06)] sm:p-8 dark:shadow-none dark:ring-1 dark:ring-border">
            <span className="eyebrow">{t("contributors.badge")}</span>
            <h2 className="font-display mt-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t("contributors.title")}
            </h2>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {contributors.map((contributor) => (
                <a
                  key={contributor.name}
                  href={contributor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-zinc-100/70 dark:hover:bg-foreground/[0.075]"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${contributor.tint} ${contributor.text}`}
                  >
                    {contributor.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-zinc-900 transition-colors group-hover:text-zellige dark:text-zinc-50">
                      {contributor.name}
                    </span>
                    <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {contributor.role}
                    </span>
                  </span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-zinc-300 transition-colors group-hover:text-zellige dark:text-zinc-600" />
                </a>
              ))}

              {/* Open seat */}
              <a
                href="https://github.com/HamzaChx/Atlas-Munich"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-zinc-100/70 dark:hover:bg-foreground/[0.075]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zellige-soft text-zellige">
                  <Plus className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-zinc-900 transition-colors group-hover:text-zellige dark:text-zinc-50">
                    {t("contributors.you")}
                  </span>
                  <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {t("contributors.joinTeam")}
                  </span>
                </span>
                <ExternalLink className="h-4 w-4 shrink-0 text-zinc-300 transition-colors group-hover:text-zellige dark:text-zinc-600" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
