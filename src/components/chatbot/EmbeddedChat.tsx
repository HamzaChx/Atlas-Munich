"use client";

// ============================================
// Atlas Munich - Embedded Chat Experience
// Full-page, immersive, mobile-first chat interface
// that replaces the floating bubble on assistant pages.
// ============================================

import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useChatbot } from "@/chatbot/use-chatbot";
import { cn } from "@/lib/utils";
import { Send, Loader2, RefreshCcw, Sparkles, ArrowLeft, X, MessageCircle } from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Theme type                                                         */
/* ------------------------------------------------------------------ */

export interface AssistantPageTheme {
  /** Header bg gradient   */ headerGradient: string;
  /** User bubble gradient */ userBubble: string;
  /** Send button gradient */ sendButton: string;
  /** Send button shadow   */ sendShadow: string;
  /** Input focus ring     */ inputRing: string;
  /** Suggestion hover     */ suggestionHover: string;
  /** Accent text          */ accentText: string;
  /** Avatar ring          */ avatarRing: string;
  /** Badge / icon bg      */ badgeBg: string;
  /** Top separator bar    */ separator: string;
  /** Online dot color     */ onlineDot: string;
  /** Glow behind avatar   */ welcomeGlow: string;
  /** Links in bot msgs    */ linkColor: string;
}

/* ------------------------------------------------------------------ */
/*  Predefined themes                                                  */
/* ------------------------------------------------------------------ */

export const THEMES: Record<string, AssistantPageTheme> = {
  healthcare: {
    headerGradient:
      "from-rose-500 via-red-500 to-pink-600 dark:from-rose-600 dark:via-red-600 dark:to-pink-700",
    userBubble: "from-rose-500 to-red-500",
    sendButton: "from-rose-500 to-red-500",
    sendShadow: "shadow-rose-500/30",
    inputRing: "focus:border-rose-500 focus:ring-rose-500/20",
    suggestionHover:
      "hover:border-rose-300 dark:hover:border-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10",
    accentText: "text-rose-600 dark:text-rose-400",
    avatarRing: "ring-rose-200 dark:ring-rose-500/40",
    badgeBg: "from-rose-500 to-red-600",
    separator: "from-red-500 via-rose-500 to-pink-500",
    onlineDot: "bg-emerald-400",
    welcomeGlow: "bg-rose-400/20 dark:bg-rose-500/15",
    linkColor: "text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300",
  },
  housing: {
    headerGradient:
      "from-amber-500 via-orange-500 to-amber-600 dark:from-amber-600 dark:via-orange-600 dark:to-amber-700",
    userBubble: "from-amber-500 to-orange-500",
    sendButton: "from-amber-500 to-orange-500",
    sendShadow: "shadow-amber-500/30",
    inputRing: "focus:border-amber-500 focus:ring-amber-500/20",
    suggestionHover:
      "hover:border-amber-300 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10",
    accentText: "text-amber-600 dark:text-amber-400",
    avatarRing: "ring-amber-200 dark:ring-amber-500/40",
    badgeBg: "from-amber-500 to-orange-600",
    separator: "from-yellow-500 via-amber-500 to-orange-500",
    onlineDot: "bg-emerald-400",
    welcomeGlow: "bg-amber-400/20 dark:bg-amber-500/15",
    linkColor: "text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300",
  },
  bureaucracy: {
    headerGradient:
      "from-teal-500 via-cyan-500 to-teal-600 dark:from-teal-600 dark:via-cyan-600 dark:to-teal-700",
    userBubble: "from-teal-500 to-cyan-500",
    sendButton: "from-teal-500 to-cyan-500",
    sendShadow: "shadow-teal-500/30",
    inputRing: "focus:border-teal-500 focus:ring-teal-500/20",
    suggestionHover:
      "hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10",
    accentText: "text-teal-600 dark:text-teal-400",
    avatarRing: "ring-teal-200 dark:ring-teal-500/40",
    badgeBg: "from-teal-500 to-cyan-600",
    separator: "from-emerald-500 via-teal-500 to-cyan-500",
    onlineDot: "bg-emerald-400",
    welcomeGlow: "bg-teal-400/20 dark:bg-teal-500/15",
    linkColor: "text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300",
  },
  academic: {
    headerGradient:
      "from-indigo-500 via-violet-500 to-purple-600 dark:from-indigo-600 dark:via-violet-600 dark:to-purple-700",
    userBubble: "from-indigo-500 to-violet-500",
    sendButton: "from-indigo-500 to-violet-500",
    sendShadow: "shadow-violet-500/30",
    inputRing: "focus:border-violet-500 focus:ring-violet-500/20",
    suggestionHover:
      "hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10",
    accentText: "text-violet-600 dark:text-violet-400",
    avatarRing: "ring-violet-200 dark:ring-violet-500/40",
    badgeBg: "from-violet-500 to-purple-600",
    separator: "from-indigo-500 via-violet-500 to-purple-500",
    onlineDot: "bg-emerald-400",
    welcomeGlow: "bg-violet-400/20 dark:bg-violet-500/15",
    linkColor:
      "text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300",
  },
};

/* ------------------------------------------------------------------ */
/*  Markdown rendering (same logic as Chatbot.tsx)                     */
/* ------------------------------------------------------------------ */

function parseInlineFormatting(text: string, linkColorClass: string): ReactNode[] {
  const result: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }
    const m = match[0];
    if (m.startsWith("**")) {
      result.push(<strong key={`b-${key++}`}>{m.slice(2, -2)}</strong>);
    } else if (m.startsWith("[")) {
      const lm = m.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (lm) {
        result.push(
          <a
            key={`l-${key++}`}
            href={lm[2]}
            className={cn("underline", linkColorClass)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {lm[1]}
          </a>
        );
      }
    }
    lastIndex = match.index + m.length;
  }

  if (lastIndex < text.length) result.push(text.slice(lastIndex));
  return result.length > 0 ? result : [text];
}

function renderMarkdown(text: string, linkColor: string) {
  const lines = text.split("\n");
  const elements: ReactNode[] = [];
  let listItems: ReactNode[] = [];

  const flush = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-2 ml-4 list-disc space-y-1">
          {listItems.map((it, i) => (
            <li key={i} className="text-sm">
              {it}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trimStart();
    const isIndented = line !== trimmed && trimmed.length > 0;

    if (trimmed.startsWith("### ")) {
      flush();
      elements.push(
        <h3 key={idx} className="text-base font-bold mt-3 mb-1">
          {parseInlineFormatting(trimmed.replace("### ", ""), linkColor)}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      flush();
      elements.push(
        <h2 key={idx} className="text-lg font-bold mt-3 mb-1">
          {parseInlineFormatting(trimmed.replace("## ", ""), linkColor)}
        </h2>
      );
    } else if (trimmed.startsWith("# ")) {
      flush();
      elements.push(
        <h1 key={idx} className="text-xl font-bold mt-3 mb-1">
          {parseInlineFormatting(trimmed.replace("# ", ""), linkColor)}
        </h1>
      );
    } else if (trimmed.match(/^[-*•]\s/)) {
      listItems.push(parseInlineFormatting(trimmed.replace(/^[-*•]\s/, ""), linkColor));
    } else if (trimmed.match(/^\d+\.\s/)) {
      flush();
      const content = trimmed.replace(/^\d+\.\s/, "");
      elements.push(
        <p key={idx} className="my-1 text-sm">
          <span className="font-semibold">{trimmed.match(/^\d+\./)?.[0]}</span>{" "}
          {parseInlineFormatting(content, linkColor)}
        </p>
      );
    } else if (isIndented) {
      flush();
      elements.push(
        <p key={idx} className="mt-2.5 mb-0.5 text-sm font-semibold">
          {parseInlineFormatting(trimmed, linkColor)}
        </p>
      );
    } else if (trimmed === "") {
      flush();
      elements.push(<div key={idx} className="h-2" />);
    } else {
      flush();
      elements.push(
        <p key={idx} className="my-1 text-sm">
          {parseInlineFormatting(line, linkColor)}
        </p>
      );
    }
  });

  flush();
  return elements;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ChatBubble({
  message,
  isUser,
  avatar,
  theme,
}: {
  message: string;
  isUser: boolean;
  avatar: string;
  theme: AssistantPageTheme;
}) {
  return (
    <div
      className={cn(
        "flex gap-2.5 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isUser && (
        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-white dark:ring-zinc-800">
          <Image src={avatar} alt="Assistant" fill className="object-cover" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed",
          isUser
            ? cn("bg-gradient-to-r text-white rounded-br-md", theme.userBubble)
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-md"
        )}
      >
        <div className="space-y-1">
          {renderMarkdown(message, isUser ? "text-white/90 hover:text-white" : theme.linkColor)}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator({ avatar }: { avatar: string }) {
  return (
    <div className="flex gap-2.5 animate-in fade-in-0 duration-300">
      <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-white dark:ring-zinc-800">
        <Image src={avatar} alt="Assistant" fill className="object-cover" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-zinc-100 dark:bg-zinc-800 px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
      </div>
    </div>
  );
}

function RedirectOverlay({
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
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-[999999] animate-in fade-in-0 slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3.5 text-white shadow-2xl shadow-emerald-500/30">
        <div className="relative h-10 w-10 flex-shrink-0">
          <svg className="h-10 w-10 -rotate-90 transform">
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke="white"
              strokeWidth="3"
              fill="none"
              strokeDasharray={100.5}
              strokeDashoffset={100.5 * (1 - secondsRemaining / 15)}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {secondsRemaining}
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-xs font-medium opacity-90 truncate">{message}</p>
          <p className="text-base font-bold truncate">{targetChatbot}</p>
        </div>
        <button
          onClick={onCancel}
          className="ml-2 flex-shrink-0 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-white/30 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

interface EmbeddedChatProps {
  section: "healthcare" | "housing" | "bureaucracy" | "academic";
}

export function EmbeddedChat({ section }: EmbeddedChatProps) {
  const theme = THEMES[section];

  const {
    messages,
    isLoading,
    error,
    currentChatbot,
    chatbotConfig,
    sendMessage,
    clearMessages,
    redirectCountdown,
    cancelRedirect,
  } = useChatbot();

  const t = useTranslations("chatbot");

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input soon after mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(timer);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Load suggestion chips from translations
  const suggestions: string[] = [];
  for (let i = 0; i < 3; i++) {
    const key = `suggestions.${currentChatbot}.${i}`;
    const val = t(key);
    if (val && val !== key) suggestions.push(val);
  }

  // Tagline
  const taglineKey = `taglines.${currentChatbot}`;
  const translatedTagline = t(taglineKey);
  const tagline = translatedTagline !== taglineKey ? translatedTagline : chatbotConfig.tagline;

  return (
    <div className="flex flex-col h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)]">
      {/* Redirect countdown — rendered in portal */}
      {redirectCountdown &&
        typeof document !== "undefined" &&
        createPortal(
          <RedirectOverlay
            message={redirectCountdown.message}
            secondsRemaining={redirectCountdown.secondsRemaining}
            targetChatbot={redirectCountdown.targetChatbot}
            onCancel={cancelRedirect}
          />,
          document.body
        )}

      {/* ── Themed Header ── */}
      <div
        className={cn(
          "flex-shrink-0 flex items-center gap-3 px-4 py-3",
          "bg-gradient-to-r shadow-lg",
          theme.headerGradient
        )}
      >
        {/* Back to tools */}
        <Link
          href="/tools"
          className="rounded-lg p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Back to tools"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {/* Avatar */}
        <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-white/30">
          <Image
            src={chatbotConfig.avatar}
            alt={chatbotConfig.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Name & status */}
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold text-white truncate">{chatbotConfig.name}</h1>
          <div className="flex items-center gap-1.5">
            <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", theme.onlineDot)} />
            <span className="text-xs text-white/70 truncate">{tagline}</span>
          </div>
        </div>

        {/* Clear / New conversation */}
        <button
          onClick={clearMessages}
          className="rounded-lg p-2 text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title="New conversation"
        >
          <RefreshCcw className="h-4 w-4 hover:rotate-180 transition-transform duration-300" />
        </button>
      </div>

      {/* ── Separator gradient ── */}
      <div
        className={cn("h-0.5 w-full bg-gradient-to-r opacity-80 flex-shrink-0", theme.separator)}
      />

      {/* ── Messages / Welcome ── */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto"
        style={{ overscrollBehaviorY: "contain" }}
      >
        {!hasMessages ? (
          /* ── Welcome Screen ── */
          <div className="flex flex-col items-center justify-center min-h-full text-center px-5 py-8 sm:py-12 animate-in fade-in-0 duration-500">
            {/* Avatar with glow */}
            <div className="relative mb-6">
              <div className={cn("absolute -inset-6 rounded-full blur-2xl", theme.welcomeGlow)} />
              <div
                className={cn(
                  "relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden ring-4",
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
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full",
                  "ring-2 ring-white dark:ring-zinc-950 bg-gradient-to-br",
                  theme.badgeBg
                )}
              >
                <MessageCircle className="h-3.5 w-3.5 text-white" />
              </div>
            </div>

            {/* Welcome text */}
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              {chatbotConfig.name}
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-md mb-8 leading-relaxed">
              {t(`welcome.${currentChatbot}`)}
            </p>

            {/* Suggestion cards */}
            <div className="w-full max-w-sm space-y-2.5">
              {suggestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className={cn(
                    "w-full text-left rounded-2xl border border-zinc-200 dark:border-zinc-700/80",
                    "bg-white dark:bg-zinc-800/60 px-4 py-3.5",
                    "hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer",
                    "flex items-center gap-3 group",
                    theme.suggestionHover
                  )}
                >
                  <div
                    className={cn(
                      "flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center",
                      "bg-gradient-to-br shadow-sm transition-transform group-hover:scale-110 duration-200",
                      theme.badgeBg
                    )}
                  >
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-snug">
                    {q}
                  </span>
                </button>
              ))}
            </div>

            {/* Powered badge */}
            <div className="mt-10 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-600">
              <Sparkles className="h-3 w-3" />
              <span>AI-powered assistant</span>
            </div>
          </div>
        ) : (
          /* ── Conversation ── */
          <div className="p-4 space-y-4 sm:max-w-2xl sm:mx-auto sm:w-full">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.content}
                isUser={msg.role === "user"}
                avatar={chatbotConfig.avatar}
                theme={theme}
              />
            ))}

            {isLoading && <TypingIndicator avatar={chatbotConfig.avatar} />}

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 animate-in fade-in-0 duration-300">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input Bar ── */}
      <div className="flex-shrink-0 border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 sm:max-w-2xl sm:mx-auto">
          <div className="flex items-end gap-2.5">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${chatbotConfig.name} anything...`}
              rows={1}
              className={cn(
                "flex-1 resize-none rounded-2xl border border-zinc-200 dark:border-zinc-700",
                "bg-zinc-50 dark:bg-zinc-800/80 px-4 py-3 text-sm",
                "text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                "focus:outline-none focus:ring-2 transition-all",
                theme.inputRing
              )}
              style={{ maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-2xl",
                "transition-all duration-200 cursor-pointer",
                input.trim() && !isLoading
                  ? cn(
                      "bg-gradient-to-r text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
                      theme.sendButton,
                      theme.sendShadow
                    )
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmbeddedChat;
