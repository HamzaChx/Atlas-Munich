"use client";

// ============================================
// Atlas Munich Chatbot - Main UI Component
// Expandable/Collapsible Chat Box Overlay
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
} from "lucide-react";

// ============================================
// Sub-components
// ============================================

// Chat bubble component
function ChatBubble({
  message,
  isUser,
  chatbotAvatar,
}: {
  message: string;
  isUser: boolean;
  chatbotAvatar: string;
}) {
  // Parse inline formatting (bold, links)
  const parseInlineFormatting = (text: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];

    // Combined regex for bold and links
    const regex = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0;
    let match;
    let keyCounter = 0;

    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        result.push(text.slice(lastIndex, match.index));
      }

      const matchedText = match[0];

      // Bold text
      if (matchedText.startsWith("**")) {
        const boldContent = matchedText.slice(2, -2);
        result.push(<strong key={`bold-${keyCounter++}`}>{boldContent}</strong>);
      }
      // Link
      else if (matchedText.startsWith("[")) {
        const linkMatch = matchedText.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          result.push(
            <a
              key={`link-${keyCounter++}`}
              href={linkMatch[2]}
              className="text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-700 dark:hover:text-emerald-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkMatch[1]}
            </a>
          );
        }
      }

      lastIndex = match.index + matchedText.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result.length > 0 ? result : [text];
  };

  // Parse and render markdown-like content
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="my-2 ml-4 list-disc space-y-1">
            {listItems.map((item, i) => (
              <li key={i} className="text-sm">
                {item}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trimStart();
      const isIndented = line !== trimmed && trimmed.length > 0;

      // Headers (check trimmed so indented headers still work)
      if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={idx} className="text-base font-bold mt-3 mb-1">
            {parseInlineFormatting(trimmed.replace("### ", ""))}
          </h3>
        );
      } else if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={idx} className="text-lg font-bold mt-3 mb-1">
            {parseInlineFormatting(trimmed.replace("## ", ""))}
          </h2>
        );
      } else if (trimmed.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={idx} className="text-xl font-bold mt-3 mb-1">
            {parseInlineFormatting(trimmed.replace("# ", ""))}
          </h1>
        );
      }
      // List items — match regardless of leading indentation
      else if (trimmed.match(/^[-*•]\s/)) {
        inList = true;
        listItems.push(parseInlineFormatting(trimmed.replace(/^[-*•]\s/, "")));
      }
      // Numbered list items
      else if (trimmed.match(/^\d+\.\s/)) {
        flushList();
        const content = trimmed.replace(/^\d+\.\s/, "");
        elements.push(
          <p key={idx} className="my-1 text-sm">
            <span className="font-semibold">{trimmed.match(/^\d+\./)?.[0]}</span>{" "}
            {parseInlineFormatting(content)}
          </p>
        );
      }
      // Indented non-bullet lines (e.g. "    Argana - Moroccan Restaurant") → bold sub-heading
      else if (isIndented) {
        flushList();
        elements.push(
          <p key={idx} className="mt-2.5 mb-0.5 text-sm font-semibold">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      }
      // Empty line
      else if (trimmed === "") {
        flushList();
        elements.push(<div key={idx} className="h-2" />);
      }
      // Regular paragraph
      else {
        flushList();
        elements.push(
          <p key={idx} className="my-1 text-sm">
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
        "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 ring-2 ring-white dark:ring-zinc-800">
          <Image src={chatbotAvatar} alt="Chatbot" fill className="object-cover" />
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 leading-relaxed",
          isUser
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-md"
        )}
      >
        <div className="space-y-1">{renderMarkdown(message)}</div>
      </div>
    </div>
  );
}

// Typing indicator
function TypingIndicator({ avatar }: { avatar: string }) {
  return (
    <div className="flex gap-3 animate-in fade-in-0 duration-300">
      <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 ring-2 ring-white dark:ring-zinc-800">
        <Image src={avatar} alt="Chatbot" fill className="object-cover" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-zinc-100 dark:bg-zinc-800 px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
      </div>
    </div>
  );
}

// Notification toast for handoffs
function HandoffNotification({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="absolute -top-16 left-0 right-0 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      <div className="mx-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-white shadow-lg shadow-orange-500/25">
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

// Countdown notification for redirect
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
      className="fixed top-4 right-4 animate-in fade-in-0 slide-in-from-right-4 duration-300"
      style={{ zIndex: 2147483647 }}
    >
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-white shadow-2xl shadow-emerald-500/30">
        {/* Countdown circle */}
        <div className="relative h-12 w-12 flex-shrink-0">
          <svg className="h-12 w-12 -rotate-90 transform">
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

        {/* Message */}
        <div className="flex flex-col">
          <p className="text-sm font-medium opacity-90">{message}</p>
          <p className="text-lg font-bold">{targetChatbot}</p>
        </div>

        {/* Cancel button */}
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

// Success notification after redirect
function SuccessNotification({
  chatbotName,
  onDismiss,
}: {
  chatbotName: string;
  onDismiss: () => void;
}) {
  return (
    <div
      className="fixed top-4 right-4 animate-in fade-in-0 slide-in-from-right-4 duration-300"
      style={{ zIndex: 2147483647 }}
    >
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white shadow-2xl shadow-green-500/30">
        {/* Success icon */}
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

        {/* Message */}
        <div className="flex flex-col">
          <p className="text-sm font-medium opacity-90">Successfully connected to</p>
          <p className="text-lg font-bold">{chatbotName}</p>
        </div>

        {/* Dismiss button */}
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
// Main Chatbot Component
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
  // Whether the user has ever opened the chat (persisted in localStorage)
  const hasInteractedRef = useRef<boolean>(
    typeof window !== "undefined" && localStorage.getItem("atlas-chatbot-interacted") === "true"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Don't render chatbot on FAQ, Community, and assistant pages
  // (assistant pages now use the embedded inline chat experience)
  const shouldHideChatbot =
    pathname === "/faq" ||
    pathname.startsWith("/faq/") ||
    pathname === "/community" ||
    pathname.startsWith("/community/") ||
    pathname === "/healthcare" ||
    pathname === "/housing" ||
    pathname === "/bureaucracy" ||
    pathname === "/academic";

  // Listen for custom "open-chatbot" events (e.g. from housing page CTA)
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
      setShowNudge(false);
      markInteracted();
    };
    window.addEventListener("open-chatbot", handleOpenChatbot);
    return () => window.removeEventListener("open-chatbot", handleOpenChatbot);
  }, [setIsOpen]);

  // Persist first interaction to localStorage
  const markInteracted = () => {
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      localStorage.setItem("atlas-chatbot-interacted", "true");
    }
  };

  // Show nudge tooltip after 8 s — only if user has never interacted before
  useEffect(() => {
    if (isOpen) {
      setShowNudge(false);
      if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
      markInteracted();
      return;
    }
    // Already interacted before — never show the nudge again
    if (hasInteractedRef.current) return;
    nudgeTimerRef.current = setTimeout(() => setShowNudge(true), 8000);
    return () => {
      if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // On mobile, auto-expand to full screen when opened
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      setIsExpanded(true);
    }
  }, [isOpen]);

  // Handle form submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Don't render on FAQ and Community pages
  if (shouldHideChatbot) {
    return null;
  }

  // Tagline: prefer translated tagline, fallback to configured tagline
  const _taglineKey = `taglines.${currentChatbot}`;
  const _translatedTagline = t(_taglineKey);
  const tagline =
    _translatedTagline && _translatedTagline !== _taglineKey
      ? _translatedTagline
      : chatbotConfig.tagline;

  return (
    <div className="chatbot-container">
      {/* Countdown Notification - Rendered in portal for proper z-index */}
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

      {/* Success Notification - Rendered in portal for proper z-index */}
      {showSuccessNotification &&
        typeof document !== "undefined" &&
        createPortal(
          <SuccessNotification
            chatbotName={currentChatbot}
            onDismiss={dismissSuccessNotification}
          />,
          document.body
        )}

      {/* Chat Window */}
      <div
        className={cn(
          "transition-all duration-500 ease-out",
          isExpanded ? "w-full h-full max-w-full" : "w-[400px] max-w-[calc(100vw-2rem)]",
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
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
            "relative flex flex-col overflow-hidden bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-900/20 dark:shadow-black/40 animate-in slide-in-from-bottom-4 duration-500",
            isExpanded
              ? "h-full w-full rounded-none border-0"
              : "h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80"
          )}
        >
          {/* Handoff Notification */}
          {notification && (
            <HandoffNotification message={notification.message} onDismiss={dismissNotification} />
          )}

          {/* Header */}
          <div
            className={cn(
              "flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4",
              isExpanded
                ? "py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-700 dark:via-teal-700 dark:to-emerald-800"
                : "py-3 bg-gradient-to-r from-zinc-50 to-zinc-100/80 dark:from-zinc-900 dark:to-zinc-800/80"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className={cn(
                  "relative overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30",
                  isExpanded
                    ? "h-10 w-10 ring-2 ring-white/30"
                    : "h-9 w-9 ring-2 ring-emerald-500/20"
                )}
              >
                <Image
                  src={chatbotConfig.avatar}
                  alt={chatbotConfig.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3
                  className={cn(
                    "font-semibold text-sm",
                    isExpanded ? "text-white" : "text-zinc-900 dark:text-white"
                  )}
                >
                  {chatbotConfig.name}
                </h3>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-block h-1.5 w-1.5 rounded-full",
                      isExpanded ? "bg-emerald-300 animate-pulse" : "bg-emerald-500 animate-pulse"
                    )}
                  />
                  <p
                    className={cn(
                      "text-xs",
                      isExpanded ? "text-white/70" : "text-zinc-500 dark:text-zinc-400"
                    )}
                  >
                    {tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={clearMessages}
                className={cn(
                  "rounded-lg p-2 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95",
                  isExpanded
                    ? "text-white/70 hover:bg-white/10 hover:text-white"
                    : "text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
                title="Clear chat"
              >
                <RefreshCcw className="h-4 w-4 transition-transform hover:rotate-180 duration-300" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "rounded-lg p-2 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95",
                  isExpanded
                    ? "text-white/70 hover:bg-white/10 hover:text-white"
                    : "text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
                className={cn(
                  "rounded-lg p-2 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95",
                  isExpanded
                    ? "text-white/70 hover:bg-white/10 hover:text-white"
                    : "text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className={cn(
              "flex-1 min-h-0 overflow-y-auto space-y-4 scroll-smooth",
              isExpanded ? "p-4 sm:p-6 sm:max-w-3xl sm:mx-auto sm:w-full" : "p-4"
            )}
          >
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div
                  className={cn(
                    "relative mb-4 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 ring-4 ring-emerald-500/20",
                    isExpanded ? "h-24 w-24" : "h-16 w-16"
                  )}
                >
                  <Image
                    src={chatbotConfig.avatar}
                    alt={chatbotConfig.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3
                  className={cn(
                    "font-semibold text-zinc-900 dark:text-white mb-1.5",
                    isExpanded ? "text-xl" : "text-lg"
                  )}
                >
                  {chatbotConfig.name}
                </h3>
                <p
                  className={cn(
                    "text-zinc-600 dark:text-zinc-400 mb-5",
                    isExpanded ? "text-base max-w-md" : "text-sm"
                  )}
                >
                  {t(`welcome.${currentChatbot}`)}
                </p>
                <div
                  className={cn("flex flex-wrap gap-2 justify-center", isExpanded && "max-w-lg")}
                >
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
                          "rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-700 border border-zinc-200 dark:border-zinc-700 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95",
                          isExpanded ? "text-sm px-4 py-2" : "text-xs px-3 py-1.5"
                        )}
                      >
                        {q}
                      </button>
                    ));
                  })()}
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
              />
            ))}

            {/* Loading indicator */}
            {isLoading && <TypingIndicator avatar={chatbotConfig.avatar} />}

            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className={cn(
              "border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
              isExpanded ? "p-3 sm:p-4" : "p-3"
            )}
          >
            <div className={cn("flex items-end gap-2", isExpanded && "sm:max-w-3xl sm:mx-auto")}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className={cn(
                  "flex-1 resize-none rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors",
                  isExpanded && "py-3 text-base"
                )}
                style={{ maxHeight: isExpanded ? "160px" : "100px" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer flex-shrink-0",
                  isExpanded ? "h-11 w-11" : "h-10 w-10",
                  input.trim() && !isLoading
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-110 active:scale-95"
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
      </div>

      {/* Floating Action Button */}
      <div
        className={cn(!isOpen || !isExpanded ? "block" : "hidden")}
        style={{ position: "fixed", bottom: "1.25rem", right: "1.25rem", zIndex: 10000 }}
      >
        {/* Nudge tooltip — appears after 8 s if user hasn't clicked */}
        {showNudge && !isOpen && (
          <div className="absolute bottom-full right-0 mb-3 w-52 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="relative rounded-2xl rounded-br-sm bg-white dark:bg-zinc-800 shadow-xl shadow-zinc-900/15 dark:shadow-black/40 border border-zinc-200/80 dark:border-zinc-700/80 px-4 py-3">
              <button
                onClick={() => setShowNudge(false)}
                className="absolute top-2 right-2 rounded-full p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white pr-4">
                Need help settling in Munich?
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                {chatbotConfig.name} is here to guide you.
              </p>
            </div>
            {/* Tail */}
            <div className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 rounded-br-sm bg-white dark:bg-zinc-800 border-r border-b border-zinc-200/80 dark:border-zinc-700/80" />
          </div>
        )}

        {/* The button */}
        <button
          onClick={() => {
            toggleOpen();
            setShowNudge(false);
          }}
          className={cn(
            "group relative flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ease-out",
            isOpen
              ? "h-12 w-12 bg-zinc-800 dark:bg-zinc-700 shadow-lg hover:bg-zinc-700 dark:hover:bg-zinc-600 hover:scale-105"
              : "h-14 w-14 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
          )}
          aria-label={isOpen ? "Close chat" : "Open AI assistant"}
        >
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-white" />
          ) : (
            <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/40">
              <Image
                src={chatbotConfig.avatar}
                alt={chatbotConfig.name}
                fill
                className="object-cover"
              />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

// Note: suggestions are loaded from translations (`messages/*.json` under `chatbot.suggestions`)

export default Chatbot;
