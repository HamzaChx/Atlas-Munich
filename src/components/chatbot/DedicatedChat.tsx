"use client";

// ============================================
// Atlas Munich – Dedicated Chat Page (Premium)
// Glass-morphism, refined animations, modern UX
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
  X,
  Sparkles,
  ChevronDown,
  Copy,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { type DedicatedChatTheme, CHAT_THEMES } from "./chat-themes";

// Re-export so existing consumers don't need to change their import paths
export type { DedicatedChatTheme };
export { CHAT_THEMES };

/* ------------------------------------------------------------------ */
/*  Markdown helpers (parameterised link colour)                       */
/* ------------------------------------------------------------------ */

function parseInlineFormatting(text: string, linkClass: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match;
  let k = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) result.push(text.slice(last, match.index));
    const m = match[0];
    if (m.startsWith("**")) {
      result.push(
        <strong key={k++} className="font-semibold">
          {m.slice(2, -2)}
        </strong>
      );
    } else {
      const lm = m.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (lm) {
        result.push(
          <a
            key={k++}
            href={lm[2]}
            className={cn(
              "inline-flex items-center gap-0.5 underline decoration-current/30 underline-offset-2 hover:decoration-current transition-colors",
              linkClass
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            {lm[1]}
            <ArrowUpRight className="h-3 w-3 opacity-60" />
          </a>
        );
      }
    }
    last = match.index + m.length;
  }
  if (last < text.length) result.push(text.slice(last));
  return result.length > 0 ? result : [text];
}

function renderMarkdown(text: string, linkClass: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={`list-${elements.length}`} className="my-2 ml-1 space-y-1.5">
        {listItems.map((item, i) => (
          <li key={i} className="text-[13.5px] leading-relaxed flex items-start gap-2">
            <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-current opacity-25 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((line, idx) => {
    const t = line.trimStart();
    const isIndented = line !== t && t.length > 0;

    if (t.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={idx} className="mt-3 mb-1 text-sm font-bold tracking-tight">
          {parseInlineFormatting(t.replace("### ", ""), linkClass)}
        </h3>
      );
    } else if (t.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={idx} className="mt-3 mb-1 text-base font-bold tracking-tight">
          {parseInlineFormatting(t.replace("## ", ""), linkClass)}
        </h2>
      );
    } else if (t.startsWith("# ")) {
      flushList();
      elements.push(
        <h1 key={idx} className="mt-3 mb-1 text-lg font-bold tracking-tight">
          {parseInlineFormatting(t.replace("# ", ""), linkClass)}
        </h1>
      );
    } else if (t.match(/^[-*•]\s/)) {
      listItems.push(parseInlineFormatting(t.replace(/^[-*•]\s/, ""), linkClass));
    } else if (t.match(/^\d+\.\s/)) {
      flushList();
      const content = t.replace(/^\d+\.\s/, "");
      elements.push(
        <p key={idx} className="my-1 text-[13.5px] leading-relaxed">
          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-current/[0.08] text-[11px] font-bold mr-1.5">
            {t.match(/^\d+/)?.[0]}
          </span>
          {parseInlineFormatting(content, linkClass)}
        </p>
      );
    } else if (isIndented) {
      flushList();
      elements.push(
        <p key={idx} className="mt-2.5 mb-0.5 text-[13.5px] font-semibold">
          {parseInlineFormatting(t, linkClass)}
        </p>
      );
    } else if (t === "") {
      flushList();
      elements.push(<div key={idx} className="h-2" />);
    } else {
      flushList();
      elements.push(
        <p key={idx} className="my-0.5 text-[13.5px] leading-relaxed">
          {parseInlineFormatting(line, linkClass)}
        </p>
      );
    }
  });

  flushList();
  return elements;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ChatBubble({
  message,
  isUser,
  chatbotAvatar,
  userBubbleGradient,
  linkClass,
  isLatest,
}: {
  message: string;
  isUser: boolean;
  chatbotAvatar: string;
  userBubbleGradient: string;
  linkClass: string;
  isLatest: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message]);

  return (
    <div
      className={cn(
        "group flex gap-3 dc-message-enter",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className="relative h-8 w-8 flex-shrink-0 mt-0.5">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200/40 to-orange-200/40 dark:from-amber-500/10 dark:to-orange-500/10 blur-[6px]" />
          <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-white/60 dark:ring-white/10 shadow-sm">
            <Image src={chatbotAvatar} alt="Assistant" fill className="object-cover" />
          </div>
        </div>
      )}

      {/* Message content */}
      <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "relative max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed transition-shadow duration-200",
            isUser
              ? cn(
                  "bg-gradient-to-br text-white rounded-br-md shadow-md hover:shadow-lg",
                  userBubbleGradient
                )
              : "bg-white/90 dark:bg-white/[0.06] backdrop-blur-sm text-zinc-800 dark:text-zinc-200 rounded-bl-md shadow-sm border border-zinc-200/60 dark:border-white/[0.06] hover:shadow-md"
          )}
        >
          <div className="space-y-0.5">{renderMarkdown(message, linkClass)}</div>
        </div>

        {/* Copy button for bot messages */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500 px-2 py-0.5 rounded-md cursor-pointer",
              "opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200",
              "hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
            aria-label="Copy message"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function TypingIndicator({
  avatar,
  dotClass,
}: {
  avatar: string;
  dotClass: string;
}) {
  return (
    <div className="flex gap-3 dc-message-enter">
      <div className="relative h-8 w-8 flex-shrink-0 mt-0.5">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200/40 to-orange-200/40 dark:from-amber-500/10 dark:to-orange-500/10 blur-[6px]" />
        <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-white/60 dark:ring-white/10 shadow-sm">
          <Image src={avatar} alt="Assistant" fill className="object-cover" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white/90 dark:bg-white/[0.06] backdrop-blur-sm px-5 py-3.5 shadow-sm border border-zinc-200/60 dark:border-white/[0.06]">
        <span
          className={cn("h-2 w-2 rounded-full dc-typing-dot", dotClass)}
          style={{ animationDelay: "0s" }}
        />
        <span
          className={cn("h-2 w-2 rounded-full dc-typing-dot", dotClass)}
          style={{ animationDelay: "0.15s" }}
        />
        <span
          className={cn("h-2 w-2 rounded-full dc-typing-dot", dotClass)}
          style={{ animationDelay: "0.3s" }}
        />
      </div>
    </div>
  );
}

function ScrollToBottomFab({
  onClick,
  accentColor,
}: {
  onClick: () => void;
  accentColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 shadow-lg border border-zinc-200/60 dark:border-zinc-700/60 cursor-pointer hover:shadow-xl transition-all duration-200 dc-scroll-fab-enter"
      aria-label="Scroll to bottom"
    >
      <ChevronDown className="h-3.5 w-3.5" />
      New messages
    </button>
  );
}

function RedirectCountdownNotification({
  message,
  secondsRemaining,
  targetChatbot,
  onCancel,
}: {
  message: string;
  secondsRemaining: number;
  targetChatbot: string;
  onCancel: () => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-white shadow-2xl shadow-emerald-500/30 backdrop-blur-xl">
        <div className="relative h-12 w-12 flex-shrink-0">
          <svg className="h-12 w-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="white"
              strokeWidth="4"
              fill="none"
              strokeDasharray={125.6}
              strokeDashoffset={125.6 * (1 - secondsRemaining / 15)}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
            {secondsRemaining}
          </span>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium opacity-90">{message}</p>
          <p className="text-lg font-bold">{targetChatbot}</p>
        </div>
        <button
          onClick={onCancel}
          className="ml-4 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/30 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function SuccessNotification({
  chatbotName,
  onDismiss,
}: {
  chatbotName: string;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white shadow-2xl shadow-green-500/30 backdrop-blur-xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium opacity-90">Successfully connected to</p>
          <p className="text-lg font-bold">{chatbotName}</p>
        </div>
        <button
          onClick={onDismiss}
          className="ml-4 rounded-full p-1 hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
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
  welcomeText,
  suggestions,
  theme,
  onSend,
}: {
  avatar: string;
  name: string;
  welcomeText: string;
  suggestions: string[];
  theme: DedicatedChatTheme;
  onSend: (msg: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-14rem)] text-center px-4 py-8 dc-welcome-enter">
      {/* Avatar with animated glow ring */}
      <div className="relative mb-6">
        <div
          className={cn(
            "absolute -inset-3 rounded-full bg-gradient-to-br opacity-40 blur-xl dc-glow-pulse",
            theme.welcomeGlow
          )}
        />
        <div
          className={cn(
            "relative h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br overflow-hidden shadow-2xl",
            theme.welcomeGlow
          )}
        >
          <div className="absolute inset-1.5 overflow-hidden rounded-full">
            <Image src={avatar} alt={name} fill className="object-cover" priority />
          </div>
        </div>
        {/* Online badge */}
        <div
          className={cn(
            "absolute bottom-1 right-1 h-5 w-5 rounded-full border-[3px] border-white dark:border-zinc-950",
            theme.onlineDot,
            "dc-online-pulse"
          )}
        />
      </div>

      {/* Name + greeting */}
      <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
        {name}
      </h2>
      <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mb-8 max-w-xs sm:max-w-md leading-relaxed">
        {welcomeText}
      </p>

      {/* Suggestion chips with staggered entrance */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 justify-center max-w-lg">
        {suggestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSend(q)}
            className={cn(
              "group/chip relative rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm",
              "text-zinc-700 dark:text-zinc-300",
              "border border-zinc-200/70 dark:border-white/[0.08]",
              "text-sm px-5 py-3 text-left",
              "transition-all duration-200 cursor-pointer",
              "hover:scale-[1.02] active:scale-[0.98]",
              "shadow-sm hover:shadow-md",
              theme.suggestionHover,
              "dc-chip-stagger"
            )}
            style={{ animationDelay: `${i * 80 + 200}ms` }}
          >
            <span className="flex items-center gap-2">
              <Sparkles
                className={cn(
                  "h-3.5 w-3.5 flex-shrink-0 opacity-50 group-hover/chip:opacity-100 transition-opacity",
                  theme.suggestionAccent
                )}
              />
              {q}
            </span>
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

  // Tagline: prefer translated, fall back to config
  const taglineKey = `taglines.${currentChatbot}`;
  const translatedTagline = t(taglineKey);
  const tagline =
    translatedTagline && translatedTagline !== taglineKey
      ? translatedTagline
      : chatbotConfig.tagline;

  // Smooth scroll to bottom
  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    if (isNearBottom) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Show/hide scroll-to-bottom FAB
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

  // Ensure input stays visible when virtual keyboard opens
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

  // Auto-dismiss handoff notification
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(dismissNotification, notification.duration);
    return () => clearTimeout(timer);
  }, [notification, dismissNotification]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
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

  // Suggestion chips from translations
  const suggestions: string[] = [];
  for (let i = 0; i < 3; i++) {
    const key = `suggestions.${currentChatbot}.${i}`;
    const val = t(key);
    if (!val || val === key) break;
    suggestions.push(val);
  }

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* ---- Portals for global notifications ---- */}
      {redirectCountdown &&
        typeof document !== "undefined" &&
        createPortal(
          <RedirectCountdownNotification
            message="Redirecting you to"
            secondsRemaining={redirectCountdown.secondsRemaining}
            targetChatbot={redirectCountdown.targetChatbot}
            onCancel={cancelRedirect}
          />,
          document.body
        )}

      {showSuccessNotification &&
        typeof document !== "undefined" &&
        createPortal(
          <SuccessNotification
            chatbotName={currentChatbot}
            onDismiss={dismissSuccessNotification}
          />,
          document.body
        )}

      {/* ---- Handoff notification (inline) ---- */}
      {notification && (
        <div className="fixed top-20 left-4 right-4 z-50 animate-in fade-in-0 slide-in-from-top-4 duration-300 sm:left-auto sm:right-6 sm:w-80">
          <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-white shadow-xl shadow-orange-500/25 backdrop-blur-xl">
            <Sparkles className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="flex-1 text-sm font-medium leading-snug">{notification.message}</p>
            <button
              onClick={dismissNotification}
              className="rounded-full p-1 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MAIN LAYOUT – fills viewport below site header                   */}
      {/* ================================================================ */}
      <div className="flex flex-col h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] overflow-hidden">
        {/* ──────────────── Header ──────────────── */}
        <header
          className={cn(
            "relative flex items-center gap-3 px-3 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r flex-shrink-0 overflow-hidden",
            theme.headerGradient
          )}
        >
          {/* Subtle noise overlay for depth */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-30 mix-blend-overlay pointer-events-none" />

          {/* Back arrow */}
          <Link
            href={backPath}
            className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 flex-shrink-0 backdrop-blur-sm"
            aria-label="Back"
          >
            <ArrowLeft className="h-[18px] w-[18px] text-white" />
          </Link>

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className={cn(
                "relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-100 shadow-lg",
                theme.avatarRing
              )}
            >
              <Image
                src={chatbotConfig.avatar}
                alt={chatbotConfig.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full overflow-hidden">
              <div className={cn("h-full w-full rounded-full border-2 border-white dark:border-zinc-900 dc-online-pulse", theme.onlineDot)} />
            </div>
          </div>

          {/* Name + status */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-[15px] sm:text-base leading-tight truncate">
              {chatbotConfig.name}
            </p>
            <p className="text-[11px] sm:text-xs text-white/60 truncate mt-0.5 font-medium">
              {tagline}
            </p>
          </div>

          {/* Clear button */}
          <button
            onClick={clearMessages}
            className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 flex-shrink-0 cursor-pointer backdrop-blur-sm group"
            title="Clear conversation"
            aria-label="Clear conversation"
          >
            <RefreshCcw className="h-4 w-4 text-white/70 group-hover:text-white transition-all group-hover:rotate-180 duration-500" />
          </button>
        </header>

        {/* ──────────────── Messages area ──────────────── */}
        <div
          ref={messagesContainerRef}
          className={cn(
            "relative flex-1 min-h-0 overflow-y-auto",
            "bg-zinc-50/80 dark:bg-zinc-950/80",
            theme.meshGradient
          )}
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {/* Subtle top edge shadow for depth */}
          <div className="sticky top-0 left-0 right-0 h-6 bg-gradient-to-b from-zinc-50/80 dark:from-zinc-950/80 to-transparent z-10 pointer-events-none" />

          <div className="sm:max-w-3xl sm:mx-auto px-4 pb-4 -mt-2 space-y-5">
            {/* Welcome state */}
            {!hasMessages && (
              <WelcomeScreen
                avatar={chatbotConfig.avatar}
                name={chatbotConfig.name}
                welcomeText={t(`welcome.${currentChatbot}`)}
                suggestions={suggestions}
                theme={theme}
                onSend={sendMessage}
              />
            )}

            {/* Message list */}
            {messages.map((msg, idx) => (
              <ChatBubble
                key={msg.id}
                message={msg.content}
                isUser={msg.role === "user"}
                chatbotAvatar={chatbotConfig.avatar}
                userBubbleGradient={theme.userBubble}
                linkClass={theme.linkColor}
                isLatest={idx === messages.length - 1}
              />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <TypingIndicator avatar={chatbotConfig.avatar} dotClass={theme.typingDot} />
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-2xl bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/60 dark:border-red-800/40 px-4 py-3 text-sm text-red-700 dark:text-red-300 dc-message-enter">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40 flex-shrink-0 mt-0.5">
                  <X className="h-3 w-3 text-red-500" />
                </div>
                <p>{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to bottom FAB */}
          {showScrollFab && (
            <ScrollToBottomFab onClick={scrollToBottom} accentColor={theme.accentColor} />
          )}
        </div>

        {/* ──────────────── Input area ──────────────── */}
        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex-shrink-0 border-t border-zinc-200/60 dark:border-zinc-800/60",
            "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl",
            "px-3 py-3 sm:px-4"
          )}
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-end gap-2.5 sm:max-w-3xl sm:mx-auto">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message…"
                rows={1}
                aria-label="Message input"
                className={cn(
                  "w-full resize-none rounded-2xl border border-zinc-200/70 dark:border-zinc-700/70",
                  "bg-zinc-50/80 dark:bg-zinc-800/50 backdrop-blur-sm",
                  "px-4 py-3 pr-4",
                  "text-[14px] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                  "outline-none transition-all duration-200",
                  theme.inputRing
                )}
                style={{ maxHeight: "120px" }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className={cn(
                "flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-2xl transition-all duration-200 cursor-pointer",
                input.trim() && !isLoading
                  ? cn(
                      "bg-gradient-to-br text-white hover:scale-105 active:scale-95",
                      theme.sendButton
                    )
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>

          {/* Keyboard hint */}
          <p className="hidden sm:block text-center text-[10px] text-zinc-400 dark:text-zinc-600 mt-2 font-medium">
            Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono text-[10px]">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono text-[10px]">Shift + Enter</kbd> for new line
          </p>
        </form>
      </div>
    </>
  );
}

export default DedicatedChat;
