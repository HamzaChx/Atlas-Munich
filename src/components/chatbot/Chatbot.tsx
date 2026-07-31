"use client";

// ============================================
// Atlas Munich Chatbot – Premium Floating UI
// Glass-morphism, micro-interactions, refined UX
// ============================================

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useChatbot } from "@/chatbot/use-chatbot";
import { cn } from "@/lib/utils";
import {
  X,
  Send,
  Loader2,
  ChevronDown,
  RefreshCcw,
  Sparkles,
  Maximize2,
  Minimize2,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";

// ============================================
// Sub-components
// ============================================

function ChatBubble({
  message,
  isUser,
  chatbotAvatar,
}: {
  message: string;
  isUser: boolean;
  chatbotAvatar: string;
}) {
  const parseInlineFormatting = (text: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0;
    let match;
    let keyCounter = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push(text.slice(lastIndex, match.index));
      }
      const matchedText = match[0];
      if (matchedText.startsWith("**")) {
        const boldContent = matchedText.slice(2, -2);
        result.push(<strong key={`bold-${keyCounter++}`} className="font-semibold">{boldContent}</strong>);
      } else if (matchedText.startsWith("[")) {
        const linkMatch = matchedText.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          result.push(
            <a
              key={`link-${keyCounter++}`}
              href={linkMatch[2]}
              className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/30 underline-offset-2 hover:decoration-emerald-500 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkMatch[1]}
              <ArrowUpRight className="h-3 w-3" />
            </a>
          );
        }
      }
      lastIndex = match.index + matchedText.length;
    }
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }
    return result.length > 0 ? result : [text];
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="my-2 ml-1 space-y-1.5">
            {listItems.map((item, i) => (
              <li key={i} className="text-[13px] leading-relaxed flex items-start gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-current opacity-30 flex-shrink-0" />
                <span>{item}</span>
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
        flushList();
        elements.push(
          <h3 key={idx} className="text-sm font-bold mt-3 mb-1 tracking-tight">
            {parseInlineFormatting(trimmed.replace("### ", ""))}
          </h3>
        );
      } else if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={idx} className="text-base font-bold mt-3 mb-1 tracking-tight">
            {parseInlineFormatting(trimmed.replace("## ", ""))}
          </h2>
        );
      } else if (trimmed.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={idx} className="text-lg font-bold mt-3 mb-1 tracking-tight">
            {parseInlineFormatting(trimmed.replace("# ", ""))}
          </h1>
        );
      } else if (trimmed.match(/^[-*•]\s/)) {
        listItems.push(parseInlineFormatting(trimmed.replace(/^[-*•]\s/, "")));
      } else if (trimmed.match(/^\d+\.\s/)) {
        flushList();
        const content = trimmed.replace(/^\d+\.\s/, "");
        elements.push(
          <p key={idx} className="my-1 text-[13px] leading-relaxed">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold mr-1.5">
              {trimmed.match(/^\d+/)?.[0]}
            </span>
            {parseInlineFormatting(content)}
          </p>
        );
      } else if (isIndented) {
        flushList();
        elements.push(
          <p key={idx} className="mt-2 mb-0.5 text-[13px] font-semibold">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      } else if (trimmed === "") {
        flushList();
        elements.push(<div key={idx} className="h-1.5" />);
      } else {
        flushList();
        elements.push(
          <p key={idx} className="my-0.5 text-[13px] leading-relaxed">
            {parseInlineFormatting(line)}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div
      className={cn(
        "flex gap-2.5 chat-message-enter",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="relative h-7 w-7 flex-shrink-0 mt-1">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-400/20 dark:from-emerald-500/10 dark:to-teal-500/10 blur-sm" />
          <div className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/80 dark:ring-white/10">
            <Image src={chatbotAvatar} alt="Chatbot" fill className="object-cover" />
          </div>
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed",
          isUser
            ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-sm shadow-lg shadow-emerald-500/15"
            : "bg-white/80 dark:bg-white/[0.06] backdrop-blur-sm text-zinc-800 dark:text-zinc-200 rounded-bl-sm border border-zinc-100/80 dark:border-white/[0.06] shadow-sm"
        )}
      >
        <div className="space-y-0.5">{renderMarkdown(message)}</div>
      </div>
    </div>
  );
}

function TypingIndicator({ avatar }: { avatar: string }) {
  return (
    <div className="flex gap-2.5 chat-message-enter">
      <div className="relative h-7 w-7 flex-shrink-0 mt-1">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-400/20 blur-sm" />
        <div className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/80 dark:ring-white/10">
          <Image src={avatar} alt="Chatbot" fill className="object-cover" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white/80 dark:bg-white/[0.06] backdrop-blur-sm px-4 py-3 border border-zinc-100/80 dark:border-white/[0.06] shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-[chat-dot_1.4s_ease-in-out_infinite]" />
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-[chat-dot_1.4s_ease-in-out_0.2s_infinite]" />
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-[chat-dot_1.4s_ease-in-out_0.4s_infinite]" />
      </div>
    </div>
  );
}

function HandoffNotification({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="absolute -top-16 left-0 right-0 chat-message-enter">
      <div className="mx-4 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-white shadow-xl shadow-orange-500/20 backdrop-blur-sm">
        <Sparkles className="h-5 w-5 flex-shrink-0" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onDismiss}
          className="rounded-full p-1 hover:bg-white/20 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
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
    <div
      className="fixed top-4 right-4 animate-in fade-in-0 slide-in-from-right-4 duration-500"
      style={{ zIndex: 2147483647 }}
    >
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-4 text-white shadow-2xl shadow-emerald-500/25 backdrop-blur-sm border border-white/10">
        <div className="relative h-12 w-12 flex-shrink-0">
          <svg className="h-12 w-12 -rotate-90 transform">
            <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.15)" strokeWidth="3" fill="none" />
            <circle
              cx="24" cy="24" r="20" stroke="white" strokeWidth="3" fill="none"
              strokeDasharray={125.6}
              strokeDashoffset={125.6 * (1 - secondsRemaining / 15)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
            {secondsRemaining}
          </span>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium opacity-70">{message}</p>
          <p className="text-lg font-bold">{targetChatbot}</p>
        </div>
        <button
          onClick={onCancel}
          className="ml-4 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25 transition-all cursor-pointer border border-white/10"
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
    <div
      className="fixed top-4 right-4 animate-in fade-in-0 slide-in-from-right-4 duration-500"
      style={{ zIndex: 2147483647 }}
    >
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 px-6 py-4 text-white shadow-2xl shadow-green-500/25 backdrop-blur-sm border border-white/10">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium opacity-70">Successfully connected to</p>
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

// ============================================
// Main Component
// ============================================

export function Chatbot() {
  const pathname = usePathname();

  const {
    messages,
    isLoading,
    error,
    currentChatbot,
    chatbotConfig,
    notification,
    isOpen,
    redirectCountdown,
    showSuccessNotification,
    sendMessage,
    clearMessages,
    toggleOpen,
    setIsOpen,
    dismissNotification,
    cancelRedirect,
    dismissSuccessNotification,
  } = useChatbot();

  const t = useTranslations("chatbot");

  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const nudgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInteractedRef = useRef<boolean>(
    typeof window !== "undefined" && localStorage.getItem("atlas-chatbot-interacted") === "true"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const shouldHideChatbot =
    pathname === "/faq" ||
    pathname.startsWith("/faq/") ||
    pathname === "/community" ||
    pathname.startsWith("/community/") ||
    pathname.startsWith("/housing") ||
    pathname.startsWith("/bureaucracy") ||
    pathname.startsWith("/academic") ||
    pathname.startsWith("/healthcare");

  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
      setShowNudge(false);
      markInteracted();
    };
    window.addEventListener("open-chatbot", handleOpenChatbot);
    return () => window.removeEventListener("open-chatbot", handleOpenChatbot);
  }, [setIsOpen]);

  const markInteracted = () => {
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      localStorage.setItem("atlas-chatbot-interacted", "true");
    }
  };

  useEffect(() => {
    if (isOpen) {
      setShowNudge(false);
      if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
      markInteracted();
      return;
    }
    if (hasInteractedRef.current) return;
    nudgeTimerRef.current = setTimeout(() => setShowNudge(true), 8000);
    return () => {
      if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      setIsExpanded(true);
    }
  }, [isOpen]);

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

  if (shouldHideChatbot) return null;

  const _taglineKey = `taglines.${currentChatbot}`;
  const _translatedTagline = t(_taglineKey);
  const tagline =
    _translatedTagline && _translatedTagline !== _taglineKey
      ? _translatedTagline
      : chatbotConfig.tagline;

  return (
    <div className="chatbot-container">
      {/* Portals */}
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
          <SuccessNotification chatbotName={currentChatbot} onDismiss={dismissSuccessNotification} />,
          document.body
        )}

      {/* =================== Chat Window =================== */}
      <div
        className={cn(
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isExpanded ? "w-full h-full max-w-full" : "w-[420px] max-w-[calc(100vw-2rem)]",
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-[0.97] pointer-events-none"
        )}
        style={{
          position: "fixed",
          bottom: isExpanded ? "0" : "6rem",
          right: isExpanded ? "0" : "1rem",
          top: isExpanded ? "0" : "auto",
          left: isExpanded ? "0" : "auto",
          zIndex: 9999,
        }}
      >
        <div
          className={cn(
            "relative flex flex-col overflow-hidden",
            isExpanded
              ? "h-full w-full rounded-none"
              : "h-[540px] max-h-[calc(100dvh-8rem)] rounded-3xl",
            "bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl",
            "shadow-2xl shadow-zinc-900/15 dark:shadow-black/40",
            "border border-zinc-200/60 dark:border-white/[0.08]",
            "ring-1 ring-black/[0.03] dark:ring-white/[0.03]"
          )}
        >
          {notification && (
            <HandoffNotification message={notification.message} onDismiss={dismissNotification} />
          )}

          {/* ---- Header ---- */}
          <div
            className={cn(
              "relative flex items-center justify-between px-4 flex-shrink-0 overflow-hidden",
              isExpanded ? "py-3.5" : "py-3"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-700 dark:via-teal-700 dark:to-emerald-800" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />

            <div className="relative flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-white/20 blur-sm" />
                <div
                  className={cn(
                    "relative overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-100",
                    isExpanded ? "h-10 w-10" : "h-9 w-9",
                    "ring-2 ring-white/30"
                  )}
                >
                  <Image src={chatbotConfig.avatar} alt={chatbotConfig.name} fill className="object-cover" />
                </div>
                <div className="absolute -bottom-0 -right-0 h-3 w-3 rounded-full bg-green-400 ring-2 ring-emerald-600 dark:ring-emerald-700">
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white tracking-tight">
                  {chatbotConfig.name}
                </h3>
                <p className="text-[11px] text-white/60 mt-0.5 truncate max-w-[180px]">
                  {tagline}
                </p>
              </div>
            </div>

            <div className="relative flex items-center gap-0.5">
              <button
                onClick={clearMessages}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer active:scale-90"
                title="Clear chat"
                aria-label="Clear chat"
              >
                <RefreshCcw className="h-4 w-4 hover:rotate-180 transition-transform duration-500" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer active:scale-90"
                title={isExpanded ? "Minimize" : "Expand"}
                aria-label={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => { setIsOpen(false); setIsExpanded(false); }}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer active:scale-90"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ---- Messages ---- */}
          <div
            className={cn(
              "flex-1 min-h-0 overflow-y-auto scroll-smooth",
              "bg-gradient-to-b from-zinc-50/50 to-zinc-100/30 dark:from-zinc-900/50 dark:to-zinc-950/80",
              isExpanded ? "p-4 sm:p-6 sm:max-w-3xl sm:mx-auto sm:w-full" : "p-4",
              "space-y-3"
            )}
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="relative mb-5">
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-400/15 dark:from-emerald-400/10 dark:to-teal-400/10 blur-xl animate-pulse" />
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30",
                      "ring-2 ring-emerald-500/20 dark:ring-emerald-400/20 shadow-lg",
                      isExpanded ? "h-24 w-24" : "h-16 w-16"
                    )}
                  >
                    <Image src={chatbotConfig.avatar} alt={chatbotConfig.name} fill className="object-cover" />
                  </div>
                </div>

                <h3
                  className={cn(
                    "font-bold text-zinc-900 dark:text-white mb-1 tracking-tight",
                    isExpanded ? "text-xl" : "text-lg"
                  )}
                >
                  {chatbotConfig.name}
                </h3>
                <p
                  className={cn(
                    "text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed",
                    isExpanded ? "text-base max-w-md" : "text-[13px] max-w-[260px]"
                  )}
                >
                  {t(`welcome.${currentChatbot}`)}
                </p>

                <div className={cn("flex flex-wrap gap-2 justify-center", isExpanded && "max-w-lg")}>
                  {(() => {
                    const suggestions: string[] = [];
                    for (let i = 0; i < 3; i++) {
                      const key = `suggestions.${currentChatbot}.${i}`;
                      const val = t(key);
                      if (!val || val === key) break;
                      suggestions.push(val);
                    }
                    return suggestions.map((q: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className={cn(
                          "group rounded-2xl border transition-all duration-200 cursor-pointer",
                          "bg-white/80 dark:bg-white/[0.05] backdrop-blur-sm",
                          "border-zinc-200/80 dark:border-white/[0.08]",
                          "text-zinc-600 dark:text-zinc-300",
                          "hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
                          "hover:border-emerald-300/60 dark:hover:border-emerald-500/20",
                          "hover:text-emerald-700 dark:hover:text-emerald-300",
                          "hover:shadow-md hover:shadow-emerald-500/5",
                          "active:scale-[0.97]",
                          isExpanded ? "text-sm px-4 py-2.5" : "text-xs px-3 py-2"
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="h-3 w-3 opacity-40 group-hover:opacity-70 transition-opacity" />
                          {q}
                        </span>
                      </button>
                    ));
                  })()}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.content}
                isUser={msg.role === "user"}
                chatbotAvatar={chatbotConfig.avatar}
              />
            ))}

            {isLoading && <TypingIndicator avatar={chatbotConfig.avatar} />}

            {error && (
              <div className="rounded-2xl bg-red-50/80 dark:bg-red-900/10 backdrop-blur-sm border border-red-200/60 dark:border-red-800/30 px-4 py-3 text-[13px] text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ---- Input ---- */}
          <form
            onSubmit={handleSubmit}
            className={cn(
              "flex-shrink-0 border-t border-zinc-200/60 dark:border-white/[0.06]",
              "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl",
              isExpanded ? "p-3 sm:p-4" : "p-3"
            )}
          >
            <div className={cn("flex items-end gap-2", isExpanded && "sm:max-w-3xl sm:mx-auto")}>
              <div className="relative flex-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  rows={1}
                  className={cn(
                    "w-full resize-none rounded-2xl",
                    "border border-zinc-200/80 dark:border-white/[0.08]",
                    "bg-zinc-50/50 dark:bg-white/[0.03]",
                    "px-4 py-2.5 text-[13px] text-zinc-900 dark:text-white",
                    "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                    "focus:outline-none focus:border-emerald-400/60 dark:focus:border-emerald-500/40",
                    "focus:ring-2 focus:ring-emerald-500/15 dark:focus:ring-emerald-500/10",
                    "focus:bg-white dark:focus:bg-white/[0.05]",
                    "transition-all duration-200",
                    isExpanded && "py-3 text-sm"
                  )}
                  style={{ maxHeight: isExpanded ? "160px" : "100px" }}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "flex items-center justify-center rounded-2xl transition-all duration-300 cursor-pointer flex-shrink-0",
                  isExpanded ? "h-11 w-11" : "h-10 w-10",
                  input.trim() && !isLoading
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95"
                    : "bg-zinc-100 dark:bg-white/[0.05] text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* =================== FAB =================== */}
      <div
        className={cn(!isOpen || !isExpanded ? "block" : "hidden")}
        style={{ position: "fixed", bottom: "1.25rem", right: "1.25rem", zIndex: 10000 }}
      >
        {showNudge && !isOpen && (
          <div className="absolute bottom-full right-0 mb-3 w-56 chat-message-enter">
            <div className="relative rounded-2xl rounded-br-sm bg-white/95 dark:bg-zinc-800/95 backdrop-blur-xl shadow-xl shadow-zinc-900/10 dark:shadow-black/30 border border-zinc-200/60 dark:border-white/[0.08] px-4 py-3">
              <button
                onClick={() => setShowNudge(false)}
                className="absolute top-2 right-2 rounded-full p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <p className="text-[13px] font-semibold text-zinc-900 dark:text-white pr-4">
                Need help settling in Munich?
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                {chatbotConfig.name} is here to guide you.
              </p>
            </div>
            <div className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 rounded-br-sm bg-white/95 dark:bg-zinc-800/95 border-r border-b border-zinc-200/60 dark:border-white/[0.08]" />
          </div>
        )}

        <button
          onClick={() => { toggleOpen(); setShowNudge(false); }}
          className={cn(
            "group relative flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isOpen
              ? "h-12 w-12 bg-zinc-800 dark:bg-zinc-700 shadow-lg hover:bg-zinc-700 dark:hover:bg-zinc-600 hover:scale-105 active:scale-95"
              : "h-14 w-14 shadow-xl hover:scale-110 active:scale-95"
          )}
          aria-label={isOpen ? "Close chat" : "Open AI assistant"}
        >
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-white" />
          ) : (
            <>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 animate-[fab-pulse_3s_ease-in-out_infinite]" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30" />
              <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/30">
                <Image src={chatbotConfig.avatar} alt={chatbotConfig.name} fill className="object-cover" />
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
