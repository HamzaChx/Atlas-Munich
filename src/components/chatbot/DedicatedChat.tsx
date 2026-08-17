"use client";

// ============================================
// Atlas Munich – dedicated chat page
//
// One floating plaster panel per assistant: tint header, tinted assistant
// bubbles, ink user bubbles, solid accent send button. Flat surfaces only,
// no gradients or blurs, same grammar as the rest of the site.
// ============================================

import {
  Suspense,
  useState,
  useRef,
  useEffect,
  useCallback,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useChatbot, blocksToText } from "@/chatbot/use-chatbot";
import type { ChatBlock } from "@/chatbot/types";
import { cn } from "@/lib/utils";
import { takePendingMessage } from "./chat-seed";
import {
  Send,
  Loader2,
  ArrowLeft,
  ArrowDown,
  ArrowUpRight,
  AlertCircle,
  Copy,
  Check,
  Trash2,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { ChatBlocks } from "./blocks";
import { HandoffToast, SuccessToast } from "./notifications";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { BottomSheet, BottomSheetContent } from "@/components/ui/bottom-sheet";
import { ASSISTANT_RESOURCES } from "@/data/assistant-resources";
import {
  ASSISTANT_ACCENTS,
  type AssistantAccent,
  type DedicatedChatTheme,
  CHAT_THEMES,
} from "./chat-themes";

// Re-exported so existing consumers keep their import paths
export type { DedicatedChatTheme };
export { CHAT_THEMES };

/* ------------------------------------------------------------------ */
/*  Message row                                                        */
/* ------------------------------------------------------------------ */

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function ChatBubble({
  blocks,
  messageId,
  isUser,
  avatar,
  accent,
  timestamp,
  showAvatar,
  streaming = false,
  statusLabel,
  onConfirmHandoff,
  onDenyHandoff,
  onConfirmLocationRequest,
  onDenyLocationRequest,
}: {
  blocks: ChatBlock[];
  messageId: string;
  isUser: boolean;
  avatar: string;
  accent: AssistantAccent;
  timestamp: Date;
  /** False for continuation messages in a consecutive run from the same sender */
  showAvatar: boolean;
  /** True while the answer is still arriving */
  streaming?: boolean;
  statusLabel?: string;
  onConfirmHandoff: (messageId: string) => void;
  onDenyHandoff: (messageId: string) => void;
  onConfirmLocationRequest: (messageId: string) => void;
  onDenyLocationRequest: (messageId: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(blocksToText(blocks));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [blocks]);

  return (
    <div className={cn("group flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <span className="mt-0.5 h-8 w-8 flex-shrink-0">
          {showAvatar && (
            <span className="relative block h-8 w-8 overflow-hidden rounded-full">
              <Image src={avatar} alt="" fill sizes="32px" className="object-cover" />
            </span>
          )}
        </span>
      )}

      <div className={cn("flex min-w-0 flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "dc-message-enter max-w-[min(42rem,85%)] rounded-2xl px-4 py-3 text-[14px] shadow-[0_1px_2px_rgb(0_0_0/0.04)]",
            isUser
              ? "rounded-br-md bg-foreground text-background"
              : cn("rounded-bl-md text-foreground", accent.tint)
          )}
        >
          <ChatBlocks
            blocks={blocks}
            messageId={messageId}
            linkClass={isUser ? "text-background" : accent.acc}
            accent={accent}
            streaming={streaming}
            statusLabel={statusLabel}
            onConfirmHandoff={onConfirmHandoff}
            onDenyHandoff={onDenyHandoff}
            onConfirmLocationRequest={onConfirmLocationRequest}
            onDenyLocationRequest={onDenyLocationRequest}
          />
        </div>

        <div
          className={cn(
            "flex items-center gap-1 px-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100",
            isUser && "flex-row-reverse"
          )}
        >
          <span className="text-[11px] font-medium tabular-nums text-zinc-400 dark:text-zinc-500">
            {formatTimestamp(timestamp)}
          </span>
          {!isUser && !streaming && (
            <button
              onClick={handleCopy}
              className={cn(
                "flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-zinc-400",
                "transition-colors hover:bg-muted hover:text-zinc-600 dark:hover:text-zinc-300"
              )}
              aria-label="Copy message"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator({
  avatar,
  accent,
  label,
}: {
  avatar: string;
  accent: AssistantAccent;
  /** e.g. "Ilham typing…" */
  label: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="relative mt-0.5 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
        <Image src={avatar} alt="" fill sizes="32px" className="object-cover" />
      </span>
      <div
        className={cn(
          "dc-message-enter flex items-center gap-2.5 rounded-2xl rounded-bl-md px-4 py-3.5",
          accent.tint
        )}
      >
        <div className="flex items-center gap-1.5">
          {[0, 0.15, 0.3].map((delay) => (
            <span
              key={delay}
              className={cn("dc-typing-dot h-1.5 w-1.5 rounded-full", accent.accBg)}
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Welcome screen                                                     */
/* ------------------------------------------------------------------ */

export interface QuickAction {
  name: string;
  avatar: string;
  href: string;
  accent: AssistantAccent;
  /** Shown as a tooltip on hover, e.g. "Housing application writer" */
  tagline?: string;
}

function WelcomeScreen({
  avatar,
  name,
  tagline,
  welcomeText,
  suggestions,
  accent,
  aiBadge,
  aiDisclaimer,
  quickActions,
  onSend,
}: {
  avatar: string;
  name: string;
  tagline: string;
  welcomeText: string;
  suggestions: string[];
  accent: AssistantAccent;
  aiBadge: string;
  aiDisclaimer: string;
  /** Direct links to specialist chats, shown only on Zellija's own page. */
  quickActions?: QuickAction[];
  onSend: (msg: string) => void;
}) {
  return (
    <div className="dc-welcome-enter flex flex-1 flex-col items-center justify-center px-2 py-8 text-center">
      <div className="relative mb-5">
        <span className={cn("absolute -inset-3 rounded-full", accent.tint)} aria-hidden="true" />
        <Image
          src={avatar}
          alt={name}
          width={128}
          height={128}
          sizes="96px"
          priority
          className={cn("relative h-24 w-24 rounded-full object-cover ring-2", accent.ring)}
        />
      </div>

      <div className="flex items-center gap-2">
        <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          {name}
        </h1>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {aiBadge}
        </span>
      </div>
      <p className={cn("mt-1 text-sm font-semibold", accent.acc)}>{tagline}</p>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500 sm:text-base dark:text-zinc-400">
        {welcomeText}
      </p>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
        {aiDisclaimer}
      </p>

      <div className="mt-8 grid w-full max-w-xl gap-2.5 sm:grid-cols-2">
        {suggestions.map((question, i) => (
          <button
            key={question}
            onClick={() => onSend(question)}
            style={{ animationDelay: `${i * 80 + 150}ms` }}
            className={cn(
              "dc-chip-stagger group/chip flex cursor-pointer items-start justify-between gap-2.5 rounded-2xl px-4 py-3 text-left text-sm text-zinc-700 dark:text-zinc-200",
              "transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0",
              accent.tint
            )}
          >
            <span className="leading-snug">{question}</span>
            <ArrowUpRight
              className={cn(
                "mt-0.5 h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover/chip:translate-x-0.5 group-hover/chip:-translate-y-0.5",
                accent.acc
              )}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {quickActions && quickActions.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {quickActions.map((action) => {
            const chip = (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  "flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-sm font-semibold text-zinc-700 outline-none transition-transform duration-200 hover:-translate-y-0.5 dark:text-zinc-200",
                  action.accent.tint,
                  action.accent.focus
                )}
              >
                <span className="relative block h-6 w-6 overflow-hidden rounded-full">
                  <Image src={action.avatar} alt="" fill sizes="24px" className="object-cover" />
                </span>
                {action.name}
              </Link>
            );

            if (!action.tagline) return chip;

            return (
              <Tooltip key={action.href}>
                <TooltipTrigger asChild>{chip}</TooltipTrigger>
                <TooltipContent>{action.tagline}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface DedicatedChatProps {
  theme: DedicatedChatTheme;
  /** Path of the parent tool page, e.g. "/healthcare" */
  backPath: string;
  /** Direct links to specialist chats, shown only on Zellija's own page. */
  quickActions?: QuickAction[];
}

/** Matches the canvas below, so the boundary costs no layout shift. */
const CANVAS = "flex flex-col h-[calc(100dvh-var(--header-h))] bg-card";

/* Reading ?q= means useSearchParams, which needs a Suspense boundary to stay
   statically prerenderable. Owning it here rather than in each of the four
   chat pages means a new assistant can't ship without one. */
export function DedicatedChat(props: DedicatedChatProps) {
  return (
    <Suspense fallback={<div className={cn(CANVAS, "overflow-hidden")} />}>
      <DedicatedChatInner {...props} />
    </Suspense>
  );
}

function DedicatedChatInner({ theme, backPath, quickActions }: DedicatedChatProps) {
  const {
    messages,
    isLoading,
    error,
    chatbotConfig,
    currentChatbot,
    notification,
    showSuccessNotification,
    sendMessage,
    clearMessages,
    dismissNotification,
    dismissSuccessNotification,
    confirmHandoff,
    denyHandoff,
    confirmLocationRequest,
    denyLocationRequest,
  } = useChatbot({ initialChatbot: theme.chatbotType });

  const t = useTranslations("chatbot");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Undefined for assistants with no outbound-resources entry (Zellija, and
  // anyone not yet live) — that absence is exactly what hides the "?" button.
  const resources = ASSISTANT_RESOURCES[currentChatbot];
  const tResources = useTranslations(resources?.namespace ?? "chatbot");

  const [input, setInput] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [showScrollFab, setShowScrollFab] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // A handoff can move the conversation to another assistant, so the hue
  // follows whoever is currently answering.
  const accent = ASSISTANT_ACCENTS[currentChatbot] ?? theme;

  const taglineKey = `taglines.${currentChatbot}`;
  const translatedTagline = t(taglineKey);
  const tagline =
    translatedTagline && translatedTagline !== taglineKey
      ? translatedTagline
      : chatbotConfig.tagline;

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    container?.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, []);

  // Follow new messages only when the reader is already at the bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distFromBottom < 150) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      setShowScrollFab(distFromBottom > 200 && messages.length > 0);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages.length]);

  // Keep the composer visible when the virtual keyboard opens
  useEffect(() => {
    const vp = window.visualViewport;
    if (!vp) return;
    const onResize = () => {
      if (document.activeElement === inputRef.current) {
        inputRef.current?.scrollIntoView({ block: "nearest" });
      }
    };
    vp.addEventListener("resize", onResize);
    return () => vp.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(dismissNotification, notification.duration);
    return () => clearTimeout(timer);
  }, [notification, dismissNotification]);

  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [input]);

  /* Arriving with something already to say, so the visitor sees a real answer
     without typing. The latch (plus the read-once slot) keeps strict mode's
     double mount from sending twice.

     The two sources get different rules on purpose. */
  const autoSentRef = useRef(false);
  useEffect(() => {
    if (autoSentRef.current) return;

    /* A paste handed over by a launch box is an explicit request made a
       moment ago. It sends even when a previous thread was restored — it
       appends to that conversation, which is what continuing with the same
       assistant should do. Bailing here would drop it silently and leave it
       in the slot to surface later, in some unrelated chat. */
    const pending = takePendingMessage(theme.chatbotType);
    if (pending) {
      autoSentRef.current = true;
      sendMessage(pending);
      return;
    }

    /* ?q= seeds a fresh conversation only, since it survives in the URL in a
       way a one-shot action does not. Dropping the param means neither a
       refresh nor clearing the chat can replay it. */
    const seed = searchParams.get("q")?.trim();
    if (!seed || messages.length > 0) return;

    autoSentRef.current = true;
    router.replace(pathname, { scroll: false });
    sendMessage(seed);
  }, [messages.length, searchParams, pathname, router, sendMessage, theme.chatbotType]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput("");
      if (inputRef.current) inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const rawSuggestions = t.raw(`suggestions.${currentChatbot}`);
  const suggestions: string[] =
    rawSuggestions && typeof rawSuggestions === "object" ? Object.values(rawSuggestions) : [];

  const aiBadge = t("aiBadge");
  const aiDisclaimer = t("aiDisclaimer");
  const typingLabel = `${chatbotConfig.name} ${t("typing")}`;

  const hasMessages = messages.length > 0;
  const canSend = input.trim().length > 0 && !isLoading;
  // Once the streaming placeholder message exists, its own bubble shows a
  // status ("Thinking…" or a named tool status) — this indicator is only for
  // the brief window before that placeholder appears, so the two never show
  // at once.
  const showTypingIndicator = isLoading && !messages.some((msg) => msg.isStreaming);

  const quietButton =
    "flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-card/70 text-zinc-600 transition-colors hover:bg-card dark:text-zinc-300";

  return (
    <>
      {showSuccessNotification &&
        typeof document !== "undefined" &&
        createPortal(
          <SuccessToast chatbotName={currentChatbot} onDismiss={dismissSuccessNotification} />,
          document.body
        )}

      {notification && (
        <HandoffToast
          message={notification.message}
          onDismiss={dismissNotification}
          className="fixed right-3 top-[4.5rem] z-[60] w-[min(22rem,calc(100vw-1.5rem))] sm:right-5 sm:top-20"
        />
      )}

      {/* Full-height edge-to-edge agentic canvas */}
      <div className={cn("relative overflow-hidden", CANVAS)}>
        {/* ---- Header ---- */}
        <header
          className={cn(
            "absolute inset-x-0 top-0 z-10 backdrop-blur-2xl bg-card/70 border-b border-border/50"
          )}
        >
          <div className="mx-auto w-full max-w-3xl flex flex-shrink-0 items-center gap-3 px-4 py-3">
            <Link href={backPath} className={quietButton} aria-label="Back">
              <ArrowLeft className="h-[18px] w-[18px]" />
            </Link>

            <div className="relative flex-shrink-0">
              <Image
                src={chatbotConfig.avatar}
                alt={chatbotConfig.name}
                width={80}
                height={80}
                sizes="40px"
                priority
                className={cn("h-10 w-10 rounded-full object-cover ring-2", accent.ring)}
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-card">
                <span className="dc-online-pulse h-2 w-2 rounded-full bg-acc-green" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-display text-[15px] font-bold leading-tight text-zinc-900 sm:text-base dark:text-zinc-50">
                  {chatbotConfig.name}
                </p>
                <span className="flex-shrink-0 rounded-full bg-card/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {aiBadge}
                </span>
              </div>
              <p className={cn("truncate text-[11px] font-medium sm:text-xs", accent.acc)}>
                {tagline}
              </p>
            </div>

            {resources && (
              <button
                onClick={() => setInfoOpen(true)}
                className={quietButton}
                title={`About ${chatbotConfig.name}`}
                aria-label={`About ${chatbotConfig.name}`}
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            )}

            {currentChatbot === "zellija" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/guides" className={quietButton} aria-label={t("browseGuidesCue")}>
                    <BookOpen className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{t("browseGuidesCue")}</TooltipContent>
              </Tooltip>
            )}

            <button
              onClick={clearMessages}
              className={cn(
                quietButton,
                "group hover:bg-tint-terra hover:text-acc-terra dark:hover:bg-tint-terra dark:hover:text-acc-terra"
              )}
              title="Clear conversation"
              aria-label="Clear conversation"
            >
              <Trash2 className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            </button>
          </div>
        </header>

        {resources && (
          <BottomSheet open={infoOpen} onOpenChange={setInfoOpen}>
            <BottomSheetContent title={chatbotConfig.name} description={tagline}>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {tResources("intro")}
              </p>

              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
                {tResources(`${resources.linksKey}.title`)}
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {tResources(`${resources.linksKey}.subtitle`)}
              </p>

              <div className="mb-2 mt-4 divide-y divide-border overflow-hidden rounded-2xl bg-muted/40">
                {resources.links.map((link) => {
                  const LinkIcon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted"
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl",
                          accent.tint,
                          accent.acc
                        )}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                          {link.name}
                        </p>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {link.label}
                        </p>
                      </div>
                      <ArrowUpRight
                        className={cn(
                          "h-4 w-4 flex-shrink-0 text-zinc-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                          accent.accHover
                        )}
                      />
                    </a>
                  );
                })}
              </div>
            </BottomSheetContent>
          </BottomSheet>
        )}

        {/* ---- Messages ---- */}
        <div
          ref={messagesContainerRef}
          className="relative min-h-0 flex-1 overflow-y-auto scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          <div
            className={cn(
              "mx-auto w-full max-w-3xl px-4 sm:px-6 pt-24 pb-40",
              hasMessages ? "space-y-5" : "flex min-h-[calc(100%-8rem)] flex-col"
            )}
          >
            {!hasMessages && (
              <WelcomeScreen
                avatar={chatbotConfig.avatar}
                name={chatbotConfig.name}
                tagline={tagline}
                welcomeText={t(`welcome.${currentChatbot}`)}
                suggestions={suggestions}
                accent={accent}
                aiBadge={aiBadge}
                aiDisclaimer={aiDisclaimer}
                quickActions={quickActions}
                onSend={sendMessage}
              />
            )}

            {messages.map((msg, i) => (
              <ChatBubble
                key={msg.id}
                blocks={msg.blocks}
                messageId={msg.id}
                isUser={msg.role === "user"}
                avatar={chatbotConfig.avatar}
                accent={accent}
                timestamp={msg.timestamp}
                showAvatar={i === 0 || messages[i - 1].role !== msg.role}
                streaming={msg.isStreaming}
                statusLabel={msg.statusLabel}
                onConfirmHandoff={confirmHandoff}
                onDenyHandoff={denyHandoff}
                onConfirmLocationRequest={confirmLocationRequest}
                onDenyLocationRequest={denyLocationRequest}
              />
            ))}

            {showTypingIndicator && (
              <TypingIndicator avatar={chatbotConfig.avatar} accent={accent} label={typingLabel} />
            )}

            {error && (
              <div className="flex items-start gap-2.5 rounded-2xl bg-tint-terra px-4 py-3 text-sm text-acc-terra">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {showScrollFab && (
            <button
              onClick={scrollToBottom}
              className="dc-scroll-fab-enter absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-[0_8px_24px_-8px_rgb(0_0_0/0.4)]"
              aria-label="Scroll to latest message"
            >
              <ArrowDown className="h-3.5 w-3.5" />
              Latest
            </button>
          )}
        </div>

        {/* ---- Composer ---- */}
        <form
          onSubmit={handleSubmit}
          className="absolute inset-x-0 bottom-0 z-10 flex-shrink-0 px-3 py-4 sm:px-6 sm:py-6 pt-12 bg-gradient-to-t from-card via-card/95 to-transparent pointer-events-none"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-3xl items-end gap-2.5 pointer-events-auto">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("typeMessage")}
              rows={1}
              aria-label="Message input"
              style={{ maxHeight: "300px" }}
              className={cn(
                "w-full flex-1 resize-none overflow-y-auto scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-3xl border border-border/50 bg-card/80 backdrop-blur-md px-5 py-3 shadow-sm",
                // 16px on phones: iOS zooms the whole page in on focus for
                // anything smaller, and never zooms back out.
                "text-base text-zinc-900 placeholder:text-zinc-400 sm:text-[14px] dark:text-zinc-50 dark:placeholder:text-zinc-500",
                "outline-none transition-all duration-200 hover:bg-card/90",
                accent.focus
              )}
            />
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send message"
              className={cn(
                "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200",
                canSend
                  ? cn("cursor-pointer text-card hover:scale-105 active:scale-95", accent.accBg)
                  : "cursor-not-allowed bg-muted text-zinc-400 dark:text-zinc-500"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
              ) : (
                <Send className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>

          <p className="mt-3 text-center text-[11px] text-zinc-400 dark:text-zinc-500 pointer-events-auto">
            {aiDisclaimer}
          </p>
          <p className="mt-1 hidden text-center text-[11px] text-zinc-400 sm:block dark:text-zinc-500 pointer-events-auto">
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd> to
            send,{" "}
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              Shift + Enter
            </kbd>{" "}
            for a new line
          </p>
        </form>
      </div>
    </>
  );
}

export default DedicatedChat;
