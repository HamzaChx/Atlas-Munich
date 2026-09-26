"use client";

// ============================================
// Atlas Munich – "Chno darrek?"
//
// Zellija's front door. One question in Darija (what's bothering you?),
// the four pains a newcomer actually arrives with, each owned by the
// specialist who handles it, and one composer that follows whichever pain
// is picked. Picking is a focus, not a navigation: the reader still says it
// in their own words, the composer just knows who is listening. With
// nothing picked, Zellija answers, which covers "chi 7aja khra" (anything
// else) without spending a card on it.
//
// Sending morphs the composer into the chat it opens (a shared
// <ViewTransition> name with DedicatedChat's docked composer), whether that
// is Zellija's thread on this page or a specialist's on theirs.
// ============================================

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  ViewTransition,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { track } from "@vercel/analytics";
import { ArrowUp, ArrowUpRight, Loader2, X } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import type { ChatbotType } from "@/chatbot/types";
import { cn } from "@/lib/utils";
import { ASSISTANT_ACCENTS } from "./chat-themes";
import { setPendingMessage } from "./chat-seed";
import { useLandingBridge } from "./landing-context";

export interface LandingSpecialist {
  chatbot: ChatbotType;
  name: string;
  chatPath: string;
  /** Cut-out character art, transparent so it sits on the card's tint */
  character: string;
  /** Optional single-colour line art (alpha mask). When present it replaces
      `character` on the card and is inked in the card's accent, so it reads
      in both themes. Produced by scripts/prepare-lineart.mjs. */
  lineArt?: string;
}

/* Darija stays Darija in every locale: it is the voice of the page, the way
   "Servus · مرحبا" is on the homepage. The reader's language sits under it. */
const DARIJA = {
  pill: "Zellija AI msawb bach i3awnek",
  title: ["Chno", "darrek"],
  pains: {
    riad: "Lkra m3eddbani",
    dalilah: "Ktrat lwra9",
    ilham: "Lmémoire ma bghach ysali",
    loubna: "Kayderni rassi",
  } as Partial<Record<ChatbotType, string>>,
  quick: {
    food: "Jou3 a sa7bi?",
    pray: "Fin nsalli?",
    study: "Fin nraje3?",
  },
} as const;

const QUICK_KEYS = ["food", "pray", "study"] as const;

const ZELLIJA_ACCENT = ASSISTANT_ACCENTS.zellija;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/*  Motion helpers                                                     */
/* ------------------------------------------------------------------ */

/** Types, holds, erases, moves on. Writes straight to the node so a ticking
    placeholder never re-renders the page. */
function useTypewriter(ref: RefObject<HTMLSpanElement | null>, phrases: string[], active: boolean) {
  const key = phrases.join("\n");

  useEffect(() => {
    const el = ref.current;
    const list = key.split("\n").filter(Boolean);
    if (!el || list.length === 0) return;
    if (!active || prefersReducedMotion()) {
      el.textContent = list[0];
      return;
    }

    let phrase = 0;
    let shown = 0;
    let erasing = false;
    let timer = 0;

    const tick = () => {
      const text = list[phrase];
      if (!erasing) {
        shown += 1;
        el.textContent = text.slice(0, shown);
        if (shown >= text.length) {
          erasing = true;
          timer = window.setTimeout(tick, 2400);
          return;
        }
        timer = window.setTimeout(tick, 24 + Math.random() * 38);
      } else {
        shown = Math.max(0, shown - 3);
        el.textContent = text.slice(0, shown);
        if (shown === 0) {
          erasing = false;
          phrase = (phrase + 1) % list.length;
          timer = window.setTimeout(tick, 320);
          return;
        }
        timer = window.setTimeout(tick, 14);
      }
    };

    el.textContent = "";
    timer = window.setTimeout(tick, 280);
    return () => window.clearTimeout(timer);
  }, [ref, key, active]);
}

const GLYPHS = "abcdefghijklmnopqrstuvwxyz3579";

/** Resolves a line out of arabizi noise, left to right, once. The server
    renders the finished text, so without JS (or with reduced motion) it is
    simply there. */
function useDecode(ref: RefObject<HTMLSpanElement | null>, text: string) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const start = performance.now() + 320;
    const duration = 850;
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - start) / duration));
      if (now - last > 40 || progress === 1) {
        last = now;
        const settled = Math.floor(progress * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (i < settled || !/\p{L}/u.test(ch)) {
            out += ch;
          } else {
            const g = GLYPHS[(Math.random() * GLYPHS.length) | 0];
            out += ch === ch.toUpperCase() ? g.toUpperCase() : g;
          }
        }
        el.textContent = out;
      }
      if (progress < 1) raf = requestAnimationFrame(frame);
      else el.textContent = text;
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [ref, text]);
}

/* ------------------------------------------------------------------ */
/*  Pain card                                                          */
/* ------------------------------------------------------------------ */

function Figure({ specialist }: { specialist: LandingSpecialist }) {
  if (specialist.lineArt) {
    // Inked with currentColor, i.e. the card's accent
    const mask = `url(${specialist.lineArt}) center / contain no-repeat`;
    return (
      <span
        className={cn("block h-full w-full bg-current", ASSISTANT_ACCENTS[specialist.chatbot].acc)}
        style={{ mask, WebkitMask: mask }}
      />
    );
  }
  return (
    <Image
      src={specialist.character}
      alt=""
      fill
      sizes="(min-width: 1024px) 112px, (min-width: 640px) 96px, 64px"
      loading="eager"
      className="object-contain"
    />
  );
}

function PainCard({
  index,
  specialist,
  line,
  helper,
  selected,
  dimmed,
  onSelect,
}: {
  index: number;
  specialist: LandingSpecialist;
  line: string;
  helper: string;
  selected: boolean;
  dimmed: boolean;
  onSelect: () => void;
}) {
  const accent = ASSISTANT_ACCENTS[specialist.chatbot];
  const ref = useRef<HTMLButtonElement>(null);

  /* The character leans toward the pointer. Mouse only: on touch there is
     no hover to follow, just a tap. */
  const handleMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    ref.current.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const handleLeave = () => {
    ref.current?.style.setProperty("--px", "0");
    ref.current?.style.setProperty("--py", "0");
  };

  return (
    // The entrance lives on a wrapper: .rise holds opacity and transform
    // with fill-mode forwards, which would pin the card's own dim and lift.
    <div className={cn("rise h-full", ["rise-3", "rise-4", "rise-5", "rise-6"][index])}>
      <button
        ref={ref}
        type="button"
        onClick={onSelect}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        aria-pressed={selected}
        aria-keyshortcuts={String(index + 1)}
        data-selected={selected || undefined}
        className={cn(
          "ask-card group relative flex h-full w-full cursor-pointer flex-col rounded-[1.75rem] p-3 text-left outline-none sm:p-4 lg:p-5",
          "focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-card",
          accent.tint,
          dimmed && "ask-card-dimmed"
        )}
      >
        {/* Selection ring in the card's own accent (rule: selected wears its
            hue, never ink). currentColor lets one class serve every hue. */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] ring-inset transition-[box-shadow] duration-300",
            accent.acc,
            selected ? "ring-2 ring-current" : "ring-0"
          )}
        />

        <kbd
          aria-hidden="true"
          className={cn(
            "absolute right-3.5 top-3.5 hidden h-6 min-w-6 items-center justify-center rounded-md px-1.5 font-mono text-[11px] font-semibold lg:flex",
            selected ? cn(accent.accBg, "text-card") : "bg-card/70 text-zinc-500 dark:text-zinc-400"
          )}
        >
          {index + 1}
        </kbd>

        <span className="ask-figure relative mx-auto mb-2 block h-16 w-16 sm:mb-3 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 h-2 w-3/5 -translate-x-1/2 rounded-[50%] bg-zinc-900/10 dark:bg-black/30"
          />
          <span className={cn("ask-lift block h-full w-full", selected && "ask-hop")}>
            <Figure specialist={specialist} />
          </span>
        </span>

        <span
          lang="ary-Latn"
          className="font-display text-[15px] font-bold leading-tight text-zinc-900 sm:text-lg lg:text-xl dark:text-zinc-50"
        >
          {DARIJA.pains[specialist.chatbot]}
        </span>
        <span className="mt-0.5 text-[12.5px] leading-snug text-zinc-600 sm:text-sm dark:text-zinc-300">
          {line}
        </span>
        <span
          className={cn(
            "mt-auto hidden pt-3 text-[12.5px] font-semibold leading-snug sm:block",
            accent.acc
          )}
        >
          {helper}
        </span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Landing                                                            */
/* ------------------------------------------------------------------ */

export function AskLanding({ specialists }: { specialists: LandingSpecialist[] }) {
  const t = useTranslations("chatbot");
  const tl = useTranslations("chatbot.landing");
  const router = useRouter();
  const { send } = useLandingBridge();

  const [focusBot, setFocusBot] = useState<ChatbotType | null>(null);
  const [input, setInput] = useState("");
  const [leaving, setLeaving] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typeRef = useRef<HTMLSpanElement>(null);
  const decodeRef = useRef<HTMLSpanElement>(null);

  const focus = specialists.find((s) => s.chatbot === focusBot) ?? null;
  const accent = focus ? ASSISTANT_ACCENTS[focus.chatbot] : ZELLIJA_ACCENT;
  const listener = focus?.name ?? "Zellija";

  const subtitle = tl("subtitle");
  useDecode(decodeRef, subtitle);

  const phrases = useMemo(() => {
    const raw = tl.raw(`prompts.${focusBot ?? "zellija"}`);
    return Array.isArray(raw) ? (raw as string[]) : [];
  }, [tl, focusBot]);
  useTypewriter(typeRef, phrases, input.length === 0);

  const suggestions = useMemo(() => {
    if (!focusBot) return [];
    const raw = t.raw(`suggestions.${focusBot}`);
    return raw && typeof raw === "object" ? (Object.values(raw) as string[]) : [];
  }, [t, focusBot]);

  const canSend = input.trim().length > 0 && !leaving;

  const select = useCallback(
    (bot: ChatbotType | null) => {
      setFocusBot((current) => (current === bot ? null : bot));
      const target = specialists.find((s) => s.chatbot === bot);
      if (target) router.prefetch(target.chatPath);
      /* Straight into typing on desktop. On a phone that would throw the
         keyboard over the cards the reader is still looking at. */
      if (window.matchMedia("(pointer: fine)").matches) {
        inputRef.current?.focus({ preventScroll: true });
      }
    },
    [router, specialists]
  );

  const submit = useCallback(
    (text: string, source: "composer" | "chip") => {
      const trimmed = text.trim();
      if (!trimmed || leaving) return;
      track("ask_landing_send", { chatbot: focus?.chatbot ?? "zellija", source });

      if (!focus) {
        send(trimmed);
        return;
      }
      /* The specialist lives on its own page. The text travels through the
         read-once pending slot (a pasted listing outgrows a URL), and the
         route change carries the composer across. */
      setLeaving(true);
      setPendingMessage(focus.chatbot, trimmed);
      router.push(focus.chatPath);
    },
    [focus, leaving, router, send]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(input, "composer");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit(input, "composer");
    } else if (e.key === "Escape" && focusBot) {
      e.preventDefault();
      setFocusBot(null);
    }
  };

  // Grow with the content: a pasted listing should be visibly received.
  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [input]);

  // 1-4 pick a pain, Esc goes back to Zellija, whenever the reader isn't typing.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= specialists.length) {
        e.preventDefault();
        select(specialists[n - 1].chatbot);
      } else if (e.key === "Escape") {
        setFocusBot(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select, specialists]);

  return (
    <section className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col items-center px-4 pt-8 sm:px-6 sm:pt-12 lg:pt-14">
      {/* ---- Voice line ---- */}
      <p className="rise rise-1 inline-flex max-w-full items-center gap-2 rounded-full bg-muted py-1.5 pl-2.5 pr-3.5 text-xs sm:text-[13px]">
        <span
          className="dc-online-pulse h-2 w-2 flex-shrink-0 rounded-full bg-acc-green"
          aria-hidden="true"
        />
        <span lang="ary-Latn" className="truncate font-semibold text-zinc-800 dark:text-zinc-100">
          {DARIJA.pill}
        </span>
        <span className="hidden text-zinc-400 sm:inline dark:text-zinc-500" aria-hidden="true">
          /
        </span>
        <span className="hidden truncate text-zinc-500 sm:inline dark:text-zinc-400">
          {tl("pill")}
        </span>
      </p>

      {/* ---- The question ---- */}
      <h1
        className="mt-5 text-center font-display text-[clamp(2.75rem,12.5vw,8.5rem)] font-extrabold leading-[0.92] tracking-[-0.035em] text-zinc-900 sm:mt-6 sm:[font-stretch:112%] dark:text-zinc-50"
        aria-label={`${DARIJA.title.join(" ")}? ${subtitle}`}
      >
        <span lang="ary-Latn" aria-hidden="true">
          <span className="rise rise-1 inline-block">{DARIJA.title[0]}</span>{" "}
          <span className="rise rise-2 inline-block">{DARIJA.title[1]}</span>
          <span className="rise rise-3 inline-block">
            <span
              className={cn(
                "ask-qmark inline-block transition-colors duration-500",
                focus ? accent.acc : "text-bloom"
              )}
            >
              ?
            </span>
          </span>
        </span>
      </h1>

      <p className="rise rise-2 mt-3 text-center text-base font-medium text-zinc-500 sm:mt-4 sm:text-xl dark:text-zinc-400">
        <span ref={decodeRef} aria-hidden="true">
          {subtitle}
        </span>
      </p>

      {/* ---- Pains ---- */}
      <div
        role="group"
        aria-label={tl("cardsLabel")}
        className="mt-7 grid w-full grid-cols-2 gap-2.5 sm:mt-10 sm:gap-3 lg:grid-cols-4 lg:gap-4"
      >
        {specialists.map((specialist, i) => (
          <PainCard
            key={specialist.chatbot}
            index={i}
            specialist={specialist}
            line={tl(`pains.${specialist.chatbot}.line`)}
            helper={tl(`pains.${specialist.chatbot}.helper`)}
            selected={focusBot === specialist.chatbot}
            dimmed={focusBot !== null && focusBot !== specialist.chatbot}
            onSelect={() => select(specialist.chatbot)}
          />
        ))}
      </div>

      {/* ---- Composer ---- sticky on phones so it stays under the thumb */}
      <form
        onSubmit={handleSubmit}
        className="rise rise-6 sticky bottom-0 z-10 mt-5 w-full max-w-2xl bg-card pt-2 sm:static sm:mt-8 sm:bg-transparent sm:pt-0"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <ViewTransition name="chat-composer">
          <div
            className={cn(
              "flex items-end gap-2 rounded-[1.75rem] border bg-card p-2 transition-[border-color,box-shadow] duration-300",
              "shadow-[0_14px_44px_-18px_rgb(0_0_0/0.28)] dark:shadow-none",
              focus
                ? "border-current"
                : "border-border focus-within:border-zinc-300 dark:focus-within:border-zinc-600",
              focus && accent.acc
            )}
          >
            {focus ? (
              <button
                type="button"
                onClick={() => setFocusBot(null)}
                aria-label={tl("clearFocus")}
                title={tl("clearFocus")}
                className={cn(
                  "ask-chip-in group/chip flex h-10 flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5 text-sm font-semibold",
                  accent.tint,
                  accent.acc
                )}
              >
                <span className="relative block h-8 w-8 overflow-hidden rounded-full bg-card/70">
                  <Image
                    src={focus.character}
                    alt=""
                    fill
                    sizes="32px"
                    className="object-contain p-0.5"
                  />
                </span>
                <span className="hidden sm:inline">{focus.name}</span>
                <X
                  className="h-3.5 w-3.5 opacity-60 transition-opacity group-hover/chip:opacity-100"
                  aria-hidden="true"
                />
              </button>
            ) : (
              <span className="relative block h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-acc-blue/25">
                <Image src="/zellija.jpeg" alt="" fill sizes="40px" className="object-cover" />
              </span>
            )}

            <div className="relative min-w-0 flex-1 text-zinc-900 dark:text-zinc-50">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                aria-label={tl("placeholder", { name: listener })}
                style={{ maxHeight: "12rem" }}
                className={cn(
                  "block w-full resize-none overflow-y-auto bg-transparent px-1.5 py-2 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                  // 16px on phones: iOS zooms in on focus for anything smaller.
                  "text-base leading-6 sm:text-[16px]"
                )}
              />
              {input.length === 0 && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-1.5 top-2 flex items-center overflow-hidden whitespace-nowrap text-base leading-6 text-zinc-400 dark:text-zinc-500"
                >
                  <span ref={typeRef} className="truncate">
                    {phrases[0]}
                  </span>
                  <span
                    className={cn(
                      "ask-caret ml-px h-5 w-[2px] flex-shrink-0 rounded-full",
                      accent.accBg
                    )}
                  />
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSend}
              aria-label={t("send")}
              className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200",
                canSend || leaving
                  ? cn("cursor-pointer text-card hover:scale-105 active:scale-95", accent.accBg)
                  : "cursor-not-allowed bg-muted text-zinc-400 dark:text-zinc-500"
              )}
            >
              {leaving ? (
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
              ) : (
                <ArrowUp className="h-5 w-5" />
              )}
            </button>
          </div>
        </ViewTransition>
      </form>

      {/* ---- Starters: Zellija's places trio, or the picked specialist's ---- */}
      <div
        key={focusBot ?? "zellija"}
        className="-mx-4 mt-1 flex w-[calc(100%+2rem)] max-w-none gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide [scrollbar-width:none] sm:mx-0 sm:mt-4 sm:w-full sm:max-w-2xl sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {focus
          ? suggestions.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => submit(s, "chip")}
                style={{ animationDelay: `${i * 60}ms` }}
                className={cn(
                  "dc-chip-stagger flex-shrink-0 cursor-pointer rounded-full px-3.5 py-2 text-[13px] font-medium text-zinc-700 transition-transform duration-200 hover:-translate-y-0.5 dark:text-zinc-200",
                  accent.tint
                )}
              >
                {s}
              </button>
            ))
          : QUICK_KEYS.map((key, i) => (
              <button
                key={key}
                type="button"
                onClick={() => submit(tl(`quick.${key}.prompt`), "chip")}
                style={{ animationDelay: `${i * 60 + 700}ms` }}
                className="dc-chip-stagger flex flex-shrink-0 cursor-pointer items-baseline gap-1.5 rounded-full bg-muted px-3.5 py-2 text-[13px] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span lang="ary-Latn" className="font-semibold text-zinc-800 dark:text-zinc-100">
                  {DARIJA.quick[key]}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">{tl(`quick.${key}.label`)}</span>
              </button>
            ))}

        {focus && (
          <Link
            href={focus.chatPath}
            className={cn(
              "dc-chip-stagger group/open flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-2 text-[13px] font-semibold",
              accent.acc
            )}
            style={{ animationDelay: `${suggestions.length * 60}ms` }}
          >
            {tl("openChat", { name: focus.name })}
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover/open:-translate-y-0.5 group-hover/open:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>

      {/* ---- Small print ---- */}
      <div className="mt-auto flex w-full flex-col items-center gap-1.5 pb-6 pt-8 text-center text-[11px] text-zinc-400 sm:pb-8 dark:text-zinc-500">
        <p>{t("aiDisclaimer")}</p>
        <p className="hidden items-center gap-1.5 sm:flex">
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">1</kbd>
          <span aria-hidden="true">–</span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            {specialists.length}
          </kbd>
          {tl("keysPick")}
          <span aria-hidden="true">·</span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>
          {tl("keysReset")}
          <span aria-hidden="true">·</span>
          <Link
            href="/guides"
            className="underline-offset-2 hover:text-zinc-600 hover:underline dark:hover:text-zinc-300"
          >
            {tl("browseGuides")}
          </Link>
        </p>
      </div>
    </section>
  );
}

export default AskLanding;
