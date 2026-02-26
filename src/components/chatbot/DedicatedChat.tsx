"use client";

// ============================================
// Atlas Munich – Dedicated Chat Page
// Full-screen, mobile-first, themed chat UI
// used on /[tool]/chat dedicated pages.
// ============================================

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useChatbot } from "@/chatbot/use-chatbot";
import { cn } from "@/lib/utils";
import { Send, Loader2, RefreshCcw, ArrowLeft, X, Sparkles } from "lucide-react";
import { type DedicatedChatTheme, CHAT_THEMES } from "./chat-themes";

// Re-export so existing consumers don't need to change their import paths
export type { DedicatedChatTheme };
export { CHAT_THEMES };

/* ------------------------------------------------------------------ */
/*  Predefined theme presets (now imported from chat-themes.ts)        */
/* ------------------------------------------------------------------ */

// All theme data lives in chat-themes.ts (a plain module with no "use client"
// so both server and client components can import CHAT_THEMES safely).

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
      result.push(<strong key={k++}>{m.slice(2, -2)}</strong>);
    } else {
      const lm = m.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (lm) {
        result.push(
          <a
            key={k++}
            href={lm[2]}
            className={cn("underline transition-colors", linkClass)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {lm[1]}
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
      <ul key={`list-${elements.length}`} className="my-2 ml-4 list-disc space-y-1">
        {listItems.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed">
            {item}
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
        <h3 key={idx} className="mt-3 mb-1 text-base font-bold">
          {parseInlineFormatting(t.replace("### ", ""), linkClass)}
        </h3>
      );
    } else if (t.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={idx} className="mt-3 mb-1 text-lg font-bold">
          {parseInlineFormatting(t.replace("## ", ""), linkClass)}
        </h2>
      );
    } else if (t.startsWith("# ")) {
      flushList();
      elements.push(
        <h1 key={idx} className="mt-3 mb-1 text-xl font-bold">
          {parseInlineFormatting(t.replace("# ", ""), linkClass)}
        </h1>
      );
    } else if (t.match(/^[-*•]\s/)) {
      listItems.push(parseInlineFormatting(t.replace(/^[-*•]\s/, ""), linkClass));
    } else if (t.match(/^\d+\.\s/)) {
      flushList();
      const content = t.replace(/^\d+\.\s/, "");
      elements.push(
        <p key={idx} className="my-1 text-sm">
          <span className="font-semibold">{t.match(/^\d+\./)?.[0]}</span>{" "}
          {parseInlineFormatting(content, linkClass)}
        </p>
      );
    } else if (isIndented) {
      flushList();
      elements.push(
        <p key={idx} className="mt-2.5 mb-0.5 text-sm font-semibold">
          {parseInlineFormatting(t, linkClass)}
        </p>
      );
    } else if (t === "") {
      flushList();
      elements.push(<div key={idx} className="h-2" />);
    } else {
      flushList();
      elements.push(
        <p key={idx} className="my-1 text-sm leading-relaxed">
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
}: {
  message: string;
  isUser: boolean;
  chatbotAvatar: string;
  userBubbleGradient: string;
  linkClass: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isUser && (
        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 ring-2 ring-white dark:ring-zinc-800 shadow-sm">
          <Image src={chatbotAvatar} alt="Assistant" fill className="object-cover" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-2.5 leading-relaxed",
          isUser
            ? cn("bg-gradient-to-br text-white rounded-br-md shadow-md", userBubbleGradient)
            : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-md shadow-sm border border-zinc-100 dark:border-zinc-700/50"
        )}
      >
        <div className="space-y-1">{renderMarkdown(message, linkClass)}</div>
      </div>
    </div>
  );
}

function TypingIndicator({ avatar }: { avatar: string }) {
  return (
    <div className="flex gap-3 animate-in fade-in-0 duration-300">
      <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 ring-2 ring-white dark:ring-zinc-800 shadow-sm">
        <Image src={avatar} alt="Assistant" fill className="object-cover" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white dark:bg-zinc-800 px-4 py-3 shadow-sm border border-zinc-100 dark:border-zinc-700/50">
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 dark:bg-zinc-500 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 dark:bg-zinc-500 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 dark:bg-zinc-500" />
      </div>
    </div>
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
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-white shadow-2xl shadow-emerald-500/30">
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
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white shadow-2xl shadow-green-500/30">
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

  // Scroll to bottom on new messages (scroll container directly to avoid scrolling the page)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading]);

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

  // Auto-dismiss handoff notification after its duration
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(dismissNotification, notification.duration);
    return () => clearTimeout(timer);
  }, [notification, dismissNotification]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput("");
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
          <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-white shadow-xl shadow-orange-500/25">
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
      {/* MAIN LAYOUT                                                       */}
      {/* Fills the viewport below the fixed site header                   */}
      {/* ================================================================ */}
      <div className="flex flex-col h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] overflow-hidden">
        {/* ---- Header bar ---- */}
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-3 sm:px-4 sm:py-3.5 bg-gradient-to-r flex-shrink-0",
            theme.headerGradient
          )}
        >
          {/* Back arrow */}
          <Link
            href={backPath}
            className="flex items-center justify-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>

          {/* Avatar */}
          <div
            className={cn(
              "relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-100",
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

          {/* Name + status */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm sm:text-base leading-tight truncate">
              {chatbotConfig.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={cn(
                  "inline-block h-1.5 w-1.5 rounded-full animate-pulse",
                  theme.onlineDot
                )}
              />
              <p className="text-xs text-white/70 truncate">{tagline}</p>
            </div>
          </div>

          {/* Clear button */}
          <button
            onClick={clearMessages}
            className="flex items-center justify-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0 cursor-pointer"
            title="Clear conversation"
            aria-label="Clear conversation"
          >
            <RefreshCcw className="h-4 w-4 text-white/80 hover:text-white transition-transform hover:rotate-180 duration-300" />
          </button>
        </div>

        {/* ---- Messages area ---- */}
        <div
          ref={messagesContainerRef}
          className="flex-1 min-h-0 overflow-y-auto bg-zinc-50 dark:bg-zinc-950"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          <div className="sm:max-w-3xl sm:mx-auto px-4 py-4 space-y-4">
            {/* Welcome state */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-14rem)] text-center px-4 py-8">
                {/* Avatar glow */}
                <div
                  className={cn(
                    "relative h-28 w-28 sm:h-32 sm:w-32 mb-5 rounded-full bg-gradient-to-br flex-shrink-0",
                    theme.welcomeGlow
                  )}
                >
                  <div className="absolute inset-2 overflow-hidden rounded-full shadow-xl">
                    <Image
                      src={chatbotConfig.avatar}
                      alt={chatbotConfig.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-1.5">
                  {chatbotConfig.name}
                </h2>
                <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mb-6 max-w-xs sm:max-w-sm">
                  {t(`welcome.${currentChatbot}`)}
                </p>

                {/* Suggestion chips */}
                <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                  {suggestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className={cn(
                        "rounded-full bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
                        "border border-zinc-200 dark:border-zinc-700",
                        "text-sm px-4 py-2",
                        "transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95",
                        theme.suggestionHover
                      )}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message list */}
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.content}
                isUser={msg.role === "user"}
                chatbotAvatar={chatbotConfig.avatar}
                userBubbleGradient={theme.userBubble}
                linkClass={theme.linkColor}
              />
            ))}

            {/* Typing indicator */}
            {isLoading && <TypingIndicator avatar={chatbotConfig.avatar} />}

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ---- Input area ---- */}
        <form
          onSubmit={handleSubmit}
          className="flex-shrink-0 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-3 sm:px-4"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-end gap-2 sm:max-w-3xl sm:mx-auto">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message…"
              rows={1}
              aria-label="Message input"
              className={cn(
                "flex-1 resize-none rounded-2xl border border-zinc-200 dark:border-zinc-700",
                "bg-zinc-50 dark:bg-zinc-800 px-4 py-3",
                "text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400",
                "outline-none transition-all",
                theme.inputRing
              )}
              style={{ maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className={cn(
                "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl transition-all duration-200 cursor-pointer",
                input.trim() && !isLoading
                  ? cn(
                      "bg-gradient-to-br text-white hover:scale-105 active:scale-95",
                      theme.sendButton
                    )
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default DedicatedChat;
