"use client";

// ============================================
// Atlas Munich – the assistant console
//
// A grid of five near-identical cards told you almost nothing about five very
// different agents. This is a roster plus a dossier instead: pick an assistant
// on the left, read its full brief on the right, wearing its own hue.
//
// Every dossier stays in the DOM (inactive ones are `hidden`) so crawlers and
// print still get all five, which a client-side switch would otherwise hide.
// ============================================

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import type { ChatbotType } from "@/chatbot/types";
import { ASSISTANT_ACCENTS } from "@/components/chatbot/chat-themes";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  The roster                                                         */
/* ------------------------------------------------------------------ */

interface Assistant {
  /** Key under the `tools.tools` namespace */
  key: string;
  name: string;
  /** Live assistants carry an avatar, a hue and somewhere to go */
  chatbot?: ChatbotType;
  avatar?: string;
  href?: string;
  chatPath?: string;
  tint: string;
  acc: string;
  ring: string;
}

/** Only the three class names a card needs, so the shape stays uniform. */
const accentOf = (chatbot: ChatbotType) => {
  const { tint, acc, ring } = ASSISTANT_ACCENTS[chatbot];
  return { tint, acc, ring };
};

const ASSISTANTS: Assistant[] = [
  {
    key: "housing",
    name: "Riad",
    chatbot: "riad",
    avatar: "/riad.webp",
    href: "/housing",
    chatPath: "/housing/chat",
    ...accentOf("riad"),
  },
  {
    key: "dalilah",
    name: "Dalilah",
    chatbot: "dalilah",
    avatar: "/dalilah.webp",
    href: "/bureaucracy",
    chatPath: "/bureaucracy/chat",
    ...accentOf("dalilah"),
  },
  {
    key: "ilham",
    name: "Ilham",
    chatbot: "ilham",
    avatar: "/ilham.webp",
    href: "/academic",
    chatPath: "/academic/chat",
    ...accentOf("ilham"),
  },
  {
    key: "loubna",
    name: "Loubna",
    chatbot: "loubna",
    avatar: "/loubna.webp",
    href: "/healthcare",
    chatPath: "/healthcare/chat",
    ...accentOf("loubna"),
  },
  {
    key: "events",
    name: "Events",
    // Still in the workshop, so it stays neutral: no hue is earned yet.
    tint: "bg-muted",
    acc: "text-zinc-500 dark:text-zinc-400",
    ring: "ring-border",
  },
];

/** i18n gives suggestion sets as objects and prompt sets as arrays. */
const asList = (value: unknown): string[] =>
  Array.isArray(value) ? (value as string[]) : Object.values((value ?? {}) as Record<string, string>);

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */

/** Live assistants show their portrait, the unbuilt one shows its initial. */
function AssistantFace({
  assistant,
  size,
  priority,
}: {
  assistant: Assistant;
  size: "sm" | "lg";
  priority?: boolean;
}) {
  const box = size === "lg" ? "h-20 w-20" : "h-11 w-11";

  if (!assistant.avatar) {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-card font-display font-bold ring-2",
          size === "lg" ? "text-2xl" : "text-base",
          box,
          assistant.ring,
          assistant.acc
        )}
      >
        {assistant.name.charAt(0)}
      </span>
    );
  }

  return (
    <span className={cn("relative shrink-0", box)}>
      <Image
        src={assistant.avatar}
        alt={assistant.name}
        width={160}
        height={160}
        quality={90}
        sizes={size === "lg" ? "80px" : "44px"}
        priority={priority}
        className={cn("h-full w-full rounded-full object-cover ring-2", assistant.ring)}
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ToolsPage() {
  const t = useTranslations("tools");
  const tChat = useTranslations("chatbot");
  const [selected, setSelected] = useState(ASSISTANTS[0].key);

  const liveCount = ASSISTANTS.filter((assistant) => assistant.href).length;

  return (
    <div className="min-h-screen bg-background">
      {/* ========== HERO ========== */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-8 pt-14 text-center sm:pb-12 sm:pt-20 2xl:max-w-3xl">
        <h1 className="rise rise-1 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl 2xl:text-6xl">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>

        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg 2xl:max-w-lg 2xl:text-xl">
          {t("subtitle")}
        </p>
      </section>

      {/* ========== MOBILE ROSTER STRIP ========== */}
      <div className="sticky top-14 z-30 bg-background py-3 shadow-[0_12px_16px_-12px_rgb(0_0_0/0.06)] sm:top-16 lg:hidden">
        <div className="hide-scrollbar-mobile overflow-x-auto px-4 sm:px-6">
          <div className="flex min-w-max items-center gap-1.5">
            {ASSISTANTS.map((assistant) => {
              const active = selected === assistant.key;
              return (
                <button
                  key={assistant.key}
                  onClick={() => setSelected(assistant.key)}
                  aria-pressed={active}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-[13px] font-semibold transition-all duration-200",
                    active
                      ? cn(assistant.tint, assistant.acc, "dark:ring-1 dark:ring-border")
                      : "bg-card text-zinc-600 shadow-sm dark:bg-foreground/[0.075] dark:text-zinc-400 dark:shadow-none"
                  )}
                >
                  {assistant.avatar ? (
                    <Image
                      src={assistant.avatar}
                      alt=""
                      width={64}
                      height={64}
                      quality={90}
                      sizes="28px"
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-card font-display text-sm font-bold">
                      {assistant.name.charAt(0)}
                    </span>
                  )}
                  {assistant.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========== CONSOLE ========== */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 lg:px-8 lg:pt-4 2xl:max-w-[88rem] 2xl:px-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 2xl:gap-12">
          {/* The roster */}
          <aside className="hidden lg:col-span-4 lg:block">
            <nav className="sticky top-24" aria-label={t("roster")}>
              <div className="mb-4 flex items-baseline justify-between">
                <p className="eyebrow">{t("roster")}</p>
                <p className="text-xs font-medium tabular-nums text-zinc-400 dark:text-zinc-500">
                  {liveCount}/{ASSISTANTS.length} {t("liveLabel")}
                </p>
              </div>

              <div className="space-y-2">
                {ASSISTANTS.map((assistant, index) => {
                  const active = selected === assistant.key;
                  return (
                    <button
                      key={assistant.key}
                      onClick={() => setSelected(assistant.key)}
                      aria-pressed={active}
                      className={cn(
                        "flex w-full items-center gap-3.5 rounded-2xl p-3 text-left transition-all duration-200",
                        active
                          ? cn(assistant.tint, "dark:ring-1 dark:ring-border")
                          : "bg-card shadow-[0_1px_8px_rgb(0_0_0/0.05)] hover:-translate-y-0.5 hover:shadow-md dark:bg-foreground/[0.075] dark:shadow-none dark:hover:bg-foreground/10"
                      )}
                    >
                      <AssistantFace assistant={assistant} size="sm" priority={index < 2} />

                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate font-display text-[15px] font-bold",
                            active ? assistant.acc : "text-zinc-900 dark:text-zinc-50"
                          )}
                        >
                          {assistant.name}
                        </span>
                        <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {t(`tools.${assistant.key}.title`)}
                        </span>
                      </span>

                      <span
                        className={cn(
                          "font-display text-xs font-bold tabular-nums",
                          active ? assistant.acc : "text-zinc-300 dark:text-zinc-600"
                        )}
                      >
                        {`0${index + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* The dossiers: all rendered, one shown */}
          <div key={selected} className="animate-in fade-in slide-in-from-bottom-2 duration-300 lg:col-span-8">
            {ASSISTANTS.map((assistant) => {
              const live = Boolean(assistant.href);
              const tags = asList(t.raw(`tools.${assistant.key}.tags`));
              const prompts = assistant.chatbot
                ? asList(tChat.raw(`suggestions.${assistant.chatbot}`))
                : asList(t.raw(`tools.${assistant.key}.prompts`));

              return (
                <div key={assistant.key} hidden={selected !== assistant.key}>
                  <article
                    className={cn(
                      "relative overflow-hidden rounded-[2rem] p-6 sm:p-9 dark:ring-1 dark:ring-border",
                      assistant.tint
                    )}
                  >
                    {/* Identity */}
                    <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
                      <AssistantFace assistant={assistant} size="lg" priority />

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                            {assistant.name}
                          </h2>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full bg-card/80 px-2.5 py-0.5 text-xs font-semibold",
                              live ? "text-acc-green" : "text-zinc-500 dark:text-zinc-400"
                            )}
                          >
                            {live ? (
                              <span className="h-1.5 w-1.5 rounded-full bg-acc-green" aria-hidden="true" />
                            ) : (
                              <span
                                className="h-1.5 w-1.5 rounded-full border border-current"
                                aria-hidden="true"
                              />
                            )}
                            {t(`tools.${assistant.key}.status`)}
                          </span>
                        </div>
                        <p className={cn("mt-1 text-sm font-semibold", assistant.acc)}>
                          {t(`tools.${assistant.key}.title`)}
                        </p>
                      </div>
                    </div>

                    {/* Brief */}
                    <p className="relative mt-6 max-w-2xl text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-200">
                      {t(`tools.${assistant.key}.description`)}
                    </p>

                    {/* What it handles */}
                    <div className="relative mt-7">
                      <p className="eyebrow">{t("capabilities")}</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        {tags.map((tag) => (
                          <div
                            key={tag}
                            className="rounded-2xl bg-card px-4 py-3 text-[13px] font-semibold leading-tight text-zinc-800 dark:text-zinc-100"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Try asking */}
                    {prompts.length > 0 && (
                      <div className="relative mt-7">
                        <p className="eyebrow">{t("tryAsking")}</p>
                        <div className="mt-3 space-y-2">
                          {prompts.map((prompt) =>
                            assistant.chatPath ? (
                              <Link
                                key={prompt}
                                href={assistant.chatPath}
                                className="block rounded-2xl bg-card px-4 py-3 text-[14px] leading-snug text-zinc-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:text-zinc-200"
                              >
                                {prompt}
                              </Link>
                            ) : (
                              <div
                                key={prompt}
                                className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 text-[14px] leading-snug text-zinc-600 dark:text-zinc-300"
                              >
                                {prompt}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="relative mt-8 flex flex-wrap items-center gap-3">
                      {live ? (
                        <>
                          <Link
                            href={assistant.href!}
                            className="inline-flex items-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-zinc-900/10 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
                          >
                            {t(`tools.${assistant.key}.cta`)}
                          </Link>
                          <Link
                            href={assistant.chatPath!}
                            className="inline-flex items-center rounded-full bg-card px-5 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-card/70 dark:text-zinc-200"
                          >
                            {t("startChat")}
                          </Link>
                        </>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-card px-5 py-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                          {t(`tools.${assistant.key}.comingSoonNote`)}
                        </span>
                      )}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========== CREDITS ========== */}
        <div className="reveal mt-12 flex flex-col items-center gap-2 rounded-[2rem] bg-tint-blue px-6 py-8 text-center dark:ring-1 dark:ring-border sm:mt-16">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {t("designedBy")}{" "}
            <a
              href="https://mohamed-nejjar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-acc-blue underline-offset-2 hover:underline"
            >
              Mohamed Nejjar
            </a>
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {t("moreComing")}{" "}
            <a
              href="https://github.com/HamzaChx/Atlas-Munich"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-acc-blue underline-offset-2 hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
