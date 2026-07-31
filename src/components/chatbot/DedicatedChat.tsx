"use client";

// ============================================
// Atlas Munich – dedicated chat page
//
// One floating plaster panel per assistant: tint header, tinted assistant
// bubbles, ink user bubbles, solid accent send button. Flat surfaces only,
// no gradients or blurs, same grammar as the rest of the site.
// ============================================

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useChatbot } from "@/chatbot/use-chatbot";
import { cn } from "@/lib/utils";
import {
  Send,
  Loader2,
  RefreshCcw,
  ArrowLeft,
  ArrowDown,
  ArrowUpRight,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { ChatMarkdown } from "./markdown";
import { HandoffToast, RedirectCountdownToast, SuccessToast } from "./notifications";
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
  message,
  isUser,
  avatar,
  accent,
  timestamp,
  showAvatar,
  streaming = false,
}: {
  message: string;
  isUser: boolean;
  avatar: string;
  accent: AssistantAccent;
  timestamp: Date;
  /** False for continuation messages in a consecutive run from the same sender */
  showAvatar: boolean;
  /** True while the answer is still arriving */
  streaming?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message]);

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
          <ChatMarkdown
            text={message}
            linkClass={isUser ? "text-background" : accent.acc}
            streaming={streaming}
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

function WelcomeScreen({
  avatar,
  name,
  tagline,
  welcomeText,
  suggestions,
  accent,
  aiBadge,
  aiDisclaimer,
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
  onSend: (msg: string) => void;
}) {
  return (
    <div className="dc-welcome-enter flex flex-1 flex-col items-center justify-center px-2 py-8 text-center">
      <div className="relative mb-5">
        <span
          className={cn("absolute -inset-3 rounded-full", accent.tint)}
          aria-hidden="true"
        />
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
}

export function DedicatedChat({ theme, backPath }: DedicatedChatProps) {
  const {
    messages,
    isLoading,
    error,
    chatbotConfig,
    currentChatbot,
    notification,
    redirectCountdown,
    showSuccessNotification,
    sendMessage,
    clearMessages,
    dismissNotification,
    cancelRedirect,
    dismissSuccessNotification,
  } = useChatbot({ initialChatbot: theme.chatbotType });

  const t = useTranslations("chatbot");

  const [input, setInput] = useState("");
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
    const distFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distFromBottom < 150) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const distFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
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
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
  }, [input]);

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

  const quietButton =
    "flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-card/70 text-zinc-600 transition-colors hover:bg-card dark:text-zinc-300";

  return (
    <>
      {redirectCountdown &&
        typeof document !== "undefined" &&
        createPortal(
          <RedirectCountdownToast
            message="Redirecting you to"
            secondsRemaining={redirectCountdown.secondsRemaining}
            targetChatbot={redirectCountdown.targetChatbot}
            accClass={accent.acc}
            onCancel={cancelRedirect}
          />,
          document.body
        )}

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

      {/* Full-height stage: the panel floats on the plaster ground on desktop
          and goes full bleed on phones. */}
      <div className="h-[calc(100dvh-3.5rem)] bg-background sm:h-[calc(100dvh-4rem)] sm:px-6 sm:py-5">
        <div
          className={cn(
            "mx-auto flex h-full max-w-4xl flex-col overflow-hidden bg-card",
            "sm:rounded-[2rem] sm:shadow-[0_8px_40px_-16px_rgb(0_0_0/0.18)] sm:dark:shadow-none",
            "dark:ring-1 dark:ring-border"
          )}
        >
          {/* ---- Header ---- */}
          <header
            className={cn(
              "flex flex-shrink-0 items-center gap-3 px-3 py-3 sm:px-4",
              accent.tint
            )}
          >
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

            <button
              onClick={clearMessages}
              className={cn(quietButton, "group")}
              title="Clear conversation"
              aria-label="Clear conversation"
            >
              <RefreshCcw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
            </button>
          </header>

          {/* ---- Messages ---- */}
          <div
            ref={messagesContainerRef}
            className="relative min-h-0 flex-1 overflow-y-auto"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            <div
              className={cn(
                "mx-auto w-full max-w-3xl px-4 sm:px-6",
                hasMessages ? "space-y-5 py-6" : "flex min-h-full flex-col py-2"
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
                  onSend={sendMessage}
                />
              )}

              {messages.map((msg, i) => (
                <ChatBubble
                  key={msg.id}
                  message={msg.content}
                  isUser={msg.role === "user"}
                  avatar={chatbotConfig.avatar}
                  accent={accent}
                  timestamp={msg.timestamp}
                  showAvatar={i === 0 || messages[i - 1].role !== msg.role}
                  streaming={msg.isStreaming}
                />
              ))}

              {isLoading && (
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
            className="flex-shrink-0 border-t border-border px-3 py-3 sm:px-6 sm:py-4"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            <div className="mx-auto flex max-w-3xl items-end gap-2.5">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("typeMessage")}
                rows={1}
                aria-label="Message input"
                style={{ maxHeight: "140px" }}
                className={cn(
                  "w-full flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-3",
                  "text-[14px] text-zinc-900 placeholder:text-zinc-400 dark:text-zinc-50 dark:placeholder:text-zinc-500",
                  "outline-none transition-colors",
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

            <p className="mt-2 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
              {aiDisclaimer}
            </p>
            <p className="mt-1 hidden text-center text-[11px] text-zinc-400 sm:block dark:text-zinc-500">
              <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd> to
              send,{" "}
              <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                Shift + Enter
              </kbd>{" "}
              for a new line
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default DedicatedChat;
