// ============================================
// Atlas Munich – assistant landing page
//
// The four tool pages (housing, bureaucracy, academic, healthcare) share one
// layout: a typographic hero, the assistant's tint panel, how-it-works cards,
// tips, an editorial link list and a closing chat band. Each page supplies its
// own hue, icons and outbound links.
// ============================================

import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import type { ChatbotType } from "@/chatbot/types";
import { ZELLIGE_MOTIF_MASK } from "@/components/shared/zellige-motif";
import { ASSISTANT_ACCENTS } from "./chat-themes";

export interface AssistantLink {
  name: string;
  label: string;
  url: string;
  icon: LucideIcon;
}

export interface AssistantLandingConfig {
  /** Translation namespace, e.g. "housing" */
  namespace: "housing" | "bureaucracy" | "academic" | "healthcare";
  chatbot: ChatbotType;
  name: string;
  avatar: string;
  /** Badge glyph sitting on the assistant's avatar */
  icon: LucideIcon;
  chatPath: string;
  stepIcons: [LucideIcon, LucideIcon, LucideIcon];
  /** Translation key of the outbound links section */
  linksKey: "platforms" | "resources" | "authorities";
  links: AssistantLink[];
}


const INK_PILL =
  "inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-zinc-900/10 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200";

const PANEL_CARD =
  "rounded-3xl bg-card shadow-[0_2px_16px_rgb(0_0_0/0.04)] dark:shadow-none dark:ring-1 dark:ring-border";

function ZelligeWatermark({ className, rotation }: { className: string; rotation: string }) {
  return (
    <span
      aria-hidden="true"
      className={`zellige-motif pointer-events-none absolute opacity-[0.13] dark:opacity-[0.2] ${className}`}
      style={
        {
          "--motif-rot": rotation,
          maskImage: ZELLIGE_MOTIF_MASK,
          WebkitMaskImage: ZELLIGE_MOTIF_MASK,
        } as React.CSSProperties
      }
    />
  );
}

export async function AssistantLanding({ config }: { config: AssistantLandingConfig }) {
  const t = await getTranslations(config.namespace);
  const tChat = await getTranslations("chatbot");
  const accent = ASSISTANT_ACCENTS[config.chatbot];
  const Badge = config.icon;

  const taglineKey = `taglines.${config.chatbot}`;
  const tagline = tChat(taglineKey);

  return (
    <div className="min-h-screen bg-background">
      {/* ========== HERO ========== */}
      <section className="mx-auto max-w-3xl px-5 pb-10 pt-14 text-center sm:pb-14 sm:pt-20">
        <h1 className="rise rise-1 font-display text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>
        <p className="rise rise-2 mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-500 sm:text-lg dark:text-zinc-400">
          {t("subtitle")}
        </p>
      </section>

      {/* ========== ASSISTANT PANEL ========== */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div
          className={`rise rise-3 relative overflow-hidden rounded-[2rem] p-7 sm:p-10 dark:ring-1 dark:ring-border ${accent.tint}`}
        >
          <ZelligeWatermark
            className={`right-0 top-1/2 h-[19rem] w-[19rem] -translate-y-1/2 translate-x-[30%] ${accent.acc}`}
            rotation="14deg"
          />

          <div className="relative flex flex-col items-center gap-7 sm:flex-row sm:items-center sm:gap-9">
            <div className="flex flex-col items-center gap-3 text-center sm:w-44 sm:flex-shrink-0">
              <div className="relative">
                <span className="absolute -inset-2 rounded-full bg-card/70" aria-hidden="true" />
                <Image
                  src={config.avatar}
                  alt={config.name}
                  width={176}
                  height={176}
                  quality={90}
                  sizes="88px"
                  priority
                  className={`relative h-22 w-22 rounded-full object-cover ring-2 ${accent.ring}`}
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card shadow-sm ${accent.acc}`}
                >
                  <Badge className="h-4 w-4" />
                </span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {config.name}
                </p>
                <p className={`text-xs font-semibold ${accent.acc}`}>{tagline}</p>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="font-display text-lg font-semibold leading-snug text-zinc-900 sm:text-xl dark:text-zinc-50">
                {t("intro")}
              </p>
              <div className="mt-6">
                <Link href={config.chatPath} className={INK_PILL}>
                  {t("cta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="reveal mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          {t("features.title")}
        </h2>

        <div className="mt-7 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {config.stepIcons.map((Icon, i) => (
            <div key={i} className={`relative p-6 sm:p-7 ${PANEL_CARD}`}>
              <span
                className={`absolute right-6 top-6 font-display text-2xl font-bold tabular-nums text-zinc-200 dark:text-foreground/10`}
              >
                {`0${i + 1}`}
              </span>
              <span
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${accent.tint} ${accent.acc}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
                {t(`features.step${i + 1}Title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t(`features.step${i + 1}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* ========== OUTBOUND LINKS ========== */}
      <section className="reveal mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          {t(`${config.linksKey}.title`)}
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {t(`${config.linksKey}.subtitle`)}
        </p>

        <div className={`mt-7 divide-y divide-border overflow-hidden ${PANEL_CARD}`}>
          {config.links.map((link) => {
            const LinkIcon = link.icon;
            return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted sm:px-7 sm:py-5"
            >
              <span
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${accent.tint} ${accent.acc}`}
              >
                <LinkIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
                  {link.name}
                </p>
                <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{link.label}</p>
              </div>
              <ArrowUpRight
                className={`h-4 w-4 flex-shrink-0 text-zinc-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${accent.accHover}`}
              />
            </a>
            );
          })}
        </div>
      </section>

      {/* ========== CLOSING CHAT BAND ========== */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <div
          className={`reveal relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:py-14 dark:ring-1 dark:ring-border ${accent.tint}`}
        >
          <ZelligeWatermark
            className={`left-0 top-1/2 h-[17rem] w-[17rem] -translate-x-[35%] -translate-y-1/2 ${accent.acc}`}
            rotation="-12deg"
          />

          <div className="relative flex flex-col items-center">
            <div className="relative mb-4">
              <span className="absolute -inset-2 rounded-full bg-card/70" aria-hidden="true" />
              <Image
                src={config.avatar}
                alt=""
                width={128}
                height={128}
                quality={90}
                sizes="64px"
                className={`relative h-16 w-16 rounded-full object-cover ring-2 ${accent.ring}`}
              />
            </div>

            <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              {config.name}
            </h2>
            <p className={`mt-1 text-sm font-semibold ${accent.acc}`}>{tagline}</p>

            <Link href={config.chatPath} className={`mt-7 ${INK_PILL}`}>
              {t("cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AssistantLanding;
