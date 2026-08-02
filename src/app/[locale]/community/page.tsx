import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GithubIcon, Mail, MessageCircle, Heart, ArrowRight } from "lucide-react";

import { ShareButton, FaqTopicGrid } from "@/components/shared";
import { getFaqsByHub } from "@/data/faqs";
import { getHub } from "@/data/hubs";
import { faqPageJsonLd } from "@/lib/structured-data";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/site-config";
import { alternatesFor, localizedUrl } from "@/lib/urls";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hubs" });

  const title = `${t("community.title")} ${t("community.titleHighlight")}`;
  return {
    title,
    description: t("community.subtitle"),
    alternates: alternatesFor(locale, "/community"),
    openGraph: {
      title: `${title} | Atlas Munich`,
      description: t("community.subtitle"),
      url: localizedUrl(locale, "/community"),
    },
  };
}

/**
 * The fourth step of the journey, and the one that holds people rather than
 * instructions. It used to be three stacked sections at the bottom of /about,
 * which meant the WhatsApp group, the way to contribute and the way to reach
 * us were each a scroll apart. Here they sit in one grid so the whole offer is
 * visible at once.
 */
export default async function CommunityPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("hubs");
  const c = await getTranslations("community");
  const a = await getTranslations("about");

  /* The broad "how do I even start" questions, which belong with the people
     rather than with any one stage of the paperwork. */
  const hubFaqs = getFaqsByHub("community");
  const faqSchema = faqPageJsonLd(hubFaqs);

  return (
    <div className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-8 pt-14 text-center sm:pb-10 sm:pt-20 2xl:max-w-3xl">
        <span className="eyebrow">{t("community.badge")}</span>
        <h1 className="rise rise-1 mt-3 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl 2xl:text-6xl">
          {t("community.title")} <span className="text-bloom">{t("community.titleHighlight")}</span>
        </h1>
        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg">
          {t("community.subtitle")}
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8 2xl:max-w-[96rem] 2xl:px-12">
        <div className="reveal grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* ========== JOIN THE GROUP ========== */}
          <section className="lg:col-span-7">
            <div className="h-full rounded-[2rem] bg-tint-green p-7 sm:p-9 dark:ring-1 dark:ring-border">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                <div className="flex-1 text-center sm:text-left">
                  <span className="eyebrow">{c("badge")}</span>
                  <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                    {c("title")} <span className="text-bloom">{c("titleHighlight")}</span>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {c("subtitle")}
                  </p>
                  <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-50">100+</span>{" "}
                    {c("stats.members")}
                  </p>
                  <a
                    href={WHATSAPP_COMMUNITY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {c("joinButton")}
                  </a>
                </div>

                <div className="shrink-0">
                  <div className="rounded-2xl bg-card p-3.5 shadow-[0_8px_30px_rgb(0_0_0/0.1)] dark:shadow-none dark:ring-1 dark:ring-border">
                    <Image
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(WHATSAPP_COMMUNITY_URL)}&bgcolor=ffffff&color=000000&margin=16`}
                      alt="WhatsApp Community QR Code"
                      width={180}
                      height={180}
                      className="h-36 w-36 rounded-lg"
                    />
                  </div>
                  <p className="mx-auto mt-3 max-w-36 text-center text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {c("qrInstructions")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ========== CONTRIBUTE ========== */}
          <section id="contribute" className="scroll-mt-24 lg:col-span-5">
            <div className="h-full rounded-[2rem] bg-card p-7 shadow-[0_2px_20px_rgb(0_0_0/0.06)] sm:p-9 dark:shadow-none dark:ring-1 dark:ring-border">
              <span className="eyebrow">{a("contribute.badge")}</span>
              <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {a("contribute.title")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {a("contribute.description")}
              </p>

              <div className="mt-7 space-y-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint-blue">
                    <MessageCircle className="h-4 w-4 text-acc-blue" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {a("contribute.suggestUpdates")}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {a("contribute.suggestUpdatesDesc")}
                    </p>
                    <Link
                      href="mailto:hamza.chaouki@tum.de"
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-zellige transition-opacity hover:opacity-80"
                    >
                      {a("contribute.contactUs")}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint-saffron">
                    <Heart className="h-4 w-4 text-acc-saffron" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {a("contribute.spreadTheWord")}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {a("contribute.spreadTheWordDesc")}
                    </p>
                    <ShareButton
                      variant="ghost"
                      size="sm"
                      text={a("contribute.share")}
                      className="mt-1 -ml-3 h-auto rounded-full px-3 py-1.5 text-sm font-semibold text-zellige hover:bg-transparent hover:text-zellige hover:opacity-80"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== GET IN TOUCH ========== */}
          <section id="contact" className="scroll-mt-24 lg:col-span-12">
            <div className="rounded-[2rem] bg-tint-saffron p-8 text-center sm:p-10 dark:ring-1 dark:ring-border">
              <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                {a("contact.title")}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-300">
                {a("contact.description")}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="https://github.com/HamzaChx/Atlas-Munich"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
                >
                  <GithubIcon className="h-4 w-4" />
                  {a("contact.github")}
                </Link>
                <Link
                  href="mailto:hamza.chaouki@tum.de"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-card dark:text-zinc-300 dark:hover:bg-foreground/10"
                >
                  <Mail className="h-4 w-4" />
                  {a("contact.emailUs")}
                </Link>
              </div>
            </div>
          </section>
        </div>

        {hubFaqs.length > 0 && (
          <section id="questions" className="reveal mt-5 scroll-mt-24">
            <h2 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              {t("questionsTitle")}
            </h2>
            <div className="mt-5">
              <FaqTopicGrid faqs={hubFaqs} hub={getHub("community")} />
            </div>
          </section>
        )}
      </div>

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </div>
  );
}
