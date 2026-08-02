"use client";

// ============================================
// Atlas Munich – floating chat widget
//
// Same grammar as the dedicated chat pages, shrunk to a corner panel:
// flat plaster card, tint header, tinted assistant bubbles, ink user bubbles.
// ============================================

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";
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
  Maximize2,
  Minimize2,
  ArrowUpRight,
  AlertCircle,
  MessageCircle,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import { ChatMarkdown } from "./markdown";
import { HandoffToast, RedirectCountdownToast, SuccessToast } from "./notifications";
import { ASSISTANT_ACCENTS, type AssistantAccent } from "./chat-themes";

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
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
  return (
    <div className={cn("group flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <span className="mt-0.5 h-7 w-7 flex-shrink-0">
          {showAvatar && (
            <span className="relative block h-7 w-7 overflow-hidden rounded-full">
              <Image src={avatar} alt="" fill sizes="28px" className="object-cover" />
            </span>
          )}
        </span>
      )}
      <div className={cn("flex min-w-0 flex-col gap-0.5", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "chat-message-enter max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] shadow-[0_1px_2px_rgb(0_0_0/0.04)]",
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
        <span className="px-1 text-[10px] font-medium tabular-nums text-zinc-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-zinc-500">
          {formatTimestamp(timestamp)}
        </span>
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
  label: string;
}) {
  return (
    <div className="flex gap-2.5">
      <span className="relative mt-0.5 h-7 w-7 flex-shrink-0 overflow-hidden rounded-full">
        <Image src={avatar} alt="" fill sizes="28px" className="object-cover" />
      </span>
      <div
        className={cn(
          "chat-message-enter flex items-center gap-2 rounded-2xl rounded-bl-md px-4 py-3.5",
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
        <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

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
    goNow,
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

  const accent = ASSISTANT_ACCENTS[currentChatbot];

  const shouldHideChatbot =
    pathname === "/faq" ||
    pathname.startsWith("/faq/") ||
    pathname === "/community" ||
    pathname.startsWith("/community/") ||
    pathname.startsWith("/housing") ||
    pathname.startsWith("/bureaucracy") ||
    pathname.startsWith("/academic") ||
    pathname.startsWith("/healthcare");

  const markInteracted = () => {
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      localStorage.setItem("atlas-chatbot-interacted", "true");
    }
  };

  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
      setShowNudge(false);
      markInteracted();
    };
    window.addEventListener("open-chatbot", handleOpenChatbot);
    return () => window.removeEventListener("open-chatbot", handleOpenChatbot);
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      // Nudge bubble must disappear the instant the widget opens, regardless
      // of which of several call sites (toggle, event, deep link) opened it.
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    // Mobile viewport width is only known once mounted in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.innerWidth < 640) setIsExpanded(true);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [input]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
      if (inputRef.current) inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (shouldHideChatbot) return null;

  const taglineKey = `taglines.${currentChatbot}`;
  const translatedTagline = t(taglineKey);
  const tagline =
    translatedTagline && translatedTagline !== taglineKey
      ? translatedTagline
      : chatbotConfig.tagline;

  const rawSuggestions = t.raw(`suggestions.${currentChatbot}`);
  const suggestions: string[] =
    rawSuggestions && typeof rawSuggestions === "object" ? Object.values(rawSuggestions) : [];

  const aiBadge = t("aiBadge");
  const aiDisclaimer = t("aiDisclaimer");
  const typingLabel = `${chatbotConfig.name} ${t("typing")}`;

  const canSend = input.trim().length > 0 && !isLoading;

  const quietButton =
    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-card/70 text-zinc-600 transition-colors hover:bg-card active:scale-90 dark:text-zinc-300";

  return (
    <div className="chatbot-container">
      {redirectCountdown &&
        typeof document !== "undefined" &&
        createPortal(
          <RedirectCountdownToast
            message="Redirecting you to"
            secondsRemaining={redirectCountdown.secondsRemaining}
            targetChatbot={redirectCountdown.targetChatbot}
            accClass={accent.acc}
            onCancel={cancelRedirect}
            onGoNow={goNow}
          />,
          document.body
        )}

      {showSuccessNotification &&
        typeof document !== "undefined" &&
        createPortal(
          <SuccessToast chatbotName={currentChatbot} onDismiss={dismissSuccessNotification} />,
          document.body
        )}

      {/* =================== Chat panel =================== */}
      <div
        className={cn(
          "fixed z-[9999] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isExpanded ? "inset-0 h-full w-full max-w-full" : "w-[420px] max-w-[calc(100vw-2rem)]",
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-[0.97] opacity-0"
        )}
        style={
          isExpanded ? undefined : { bottom: "6rem", right: "1rem", top: "auto", left: "auto" }
        }
      >
        <div
          className={cn(
            "relative flex flex-col overflow-hidden bg-card",
            isExpanded
              ? "h-full w-full rounded-none"
              : "h-[560px] max-h-[calc(100dvh-8rem)] rounded-[2rem] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.4)] dark:shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]",
            "ring-1 ring-border/50 dark:ring-white/10"
          )}
        >
          {notification && (
            <HandoffToast
              message={notification.message}
              onDismiss={dismissNotification}
              className="absolute inset-x-3 top-3 z-30"
            />
          )}

          {/* ---- Header ---- */}
          <header
            className={cn(
              "absolute inset-x-0 top-0 z-10 flex flex-shrink-0 items-center justify-between gap-2 px-4 py-3 backdrop-blur-2xl bg-card/70 border-b border-border/50 transition-colors"
            )}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="relative flex-shrink-0">
                <Image
                  src={chatbotConfig.avatar}
                  alt={chatbotConfig.name}
                  width={72}
                  height={72}
                  sizes="36px"
                  className={cn("h-9 w-9 rounded-full object-cover ring-2", accent.ring)}
                />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-card">
                  <span className="dc-online-pulse h-1.5 w-1.5 rounded-full bg-acc-green" />
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate font-display text-sm font-bold leading-tight text-zinc-900 dark:text-zinc-50">
                    {chatbotConfig.name}
                  </p>
                  <span className="flex-shrink-0 rounded-full bg-card/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {aiBadge}
                  </span>
                </div>
                <p className={cn("truncate text-[11px] font-medium", accent.acc)}>{tagline}</p>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-1">
              <button
                onClick={clearMessages}
                className={cn(
                  quietButton,
                  "group hover:bg-tint-terra hover:text-acc-terra dark:hover:bg-tint-terra dark:hover:text-acc-terra"
                )}
                title="Clear chat"
                aria-label="Clear chat"
              >
                <Trash2 className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(quietButton, "hidden sm:flex")}
                title={isExpanded ? "Minimize" : "Expand"}
                aria-label={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
                className={quietButton}
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* ---- Messages ---- */}
          <div
            className={cn(
              "min-h-0 flex-1 space-y-3 overflow-y-auto scroll-smooth p-4 pt-20 pb-28 scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              isExpanded && "sm:mx-auto sm:w-full sm:max-w-3xl sm:p-6 sm:pt-24 sm:pb-32"
            )}
          >
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center px-2 text-center">
                <div className="relative mb-4">
                  <span
                    className={cn("absolute -inset-2.5 rounded-full", accent.tint)}
                    aria-hidden="true"
                  />
                  <Image
                    src={chatbotConfig.avatar}
                    alt={chatbotConfig.name}
                    width={128}
                    height={128}
                    sizes="80px"
                    className={cn(
                      "relative rounded-full object-cover ring-2",
                      accent.ring,
                      isExpanded ? "h-20 w-20" : "h-16 w-16"
                    )}
                  />
                </div>

                <h2
                  className={cn(
                    "font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50",
                    isExpanded ? "text-xl" : "text-lg"
                  )}
                >
                  {chatbotConfig.name}
                </h2>
                <p className={cn("mt-0.5 text-xs font-semibold", accent.acc)}>{tagline}</p>

                <p
                  className={cn(
                    "mt-3 leading-relaxed text-zinc-500 dark:text-zinc-400",
                    isExpanded ? "max-w-md text-sm" : "max-w-[280px] text-[13px]"
                  )}
                >
                  {t(`welcome.${currentChatbot}`)}
                </p>
                <p className="mt-1.5 max-w-[280px] text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
                  {aiDisclaimer}
                </p>

                <div
                  className={cn(
                    "mt-5 grid w-full gap-2",
                    isExpanded ? "max-w-lg sm:grid-cols-2" : "max-w-[320px]"
                  )}
                >
                  {suggestions.map((question, i) => (
                    <button
                      key={question}
                      onClick={() => sendMessage(question)}
                      style={{ animationDelay: `${i * 70 + 120}ms` }}
                      className={cn(
                        "dc-chip-stagger group/chip flex cursor-pointer items-start justify-between gap-2 rounded-2xl px-3.5 py-2.5 text-left text-xs text-zinc-700 dark:text-zinc-200",
                        "transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0",
                        accent.tint
                      )}
                    >
                      <span className="leading-snug">{question}</span>
                      <ArrowUpRight
                        className={cn(
                          "mt-0.5 h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 group-hover/chip:translate-x-0.5 group-hover/chip:-translate-y-0.5",
                          accent.acc
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
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
              <div className="flex items-start gap-2 rounded-2xl bg-tint-terra px-4 py-3 text-[13px] text-acc-terra">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ---- Composer ---- */}
          <form
            onSubmit={handleSubmit}
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 flex-shrink-0 p-4 pt-8 bg-gradient-to-t from-background via-background/90 to-transparent",
              isExpanded && "sm:px-6 sm:pb-6"
            )}
          >
            <div className={cn("flex items-end gap-2", isExpanded && "sm:mx-auto sm:max-w-3xl")}>
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
                  "w-full flex-1 resize-none overflow-y-auto scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-3xl border border-border/50 bg-card/80 backdrop-blur-md px-5 py-3.5 shadow-sm",
                  // 16px on phones: iOS zooms the whole page in on focus for
                  // anything smaller, and never zooms back out.
                  "text-base text-zinc-900 placeholder:text-zinc-400 sm:text-[13px] dark:text-zinc-50 dark:placeholder:text-zinc-500",
                  "outline-none transition-all duration-200 hover:bg-card/90",
                  accent.focus,
                  isExpanded && "sm:py-4 sm:text-sm"
                )}
              />
              <button
                type="submit"
                disabled={!canSend}
                aria-label="Send message"
                className={cn(
                  "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200",
                  canSend
                    ? cn("cursor-pointer text-card hover:scale-105 active:scale-95", accent.accBg)
                    : "cursor-not-allowed bg-muted text-zinc-400 dark:text-zinc-500"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
            <p
              className={cn(
                "mt-2.5 text-center text-[10px] leading-snug text-zinc-400 dark:text-zinc-500",
                isExpanded && "sm:mx-auto sm:max-w-3xl"
              )}
            >
              {aiDisclaimer}
            </p>
          </form>
        </div>
      </div>

      {/* =================== Launcher ===================
          Desktop only: on mobile "Ask Atlas AI" inside the search overlay
          opens this same widget, and a corner button here would sit on top
          of the floating nav controls. */}
      <div
        className={cn(
          "fixed bottom-5 right-5 z-[10000]",
          !isOpen || !isExpanded ? "hidden md:block" : "hidden"
        )}
      >
        {showNudge && !isOpen && (
          <div className="chat-message-enter absolute bottom-full right-0 mb-3 w-60">
            <div className="relative rounded-2xl rounded-br-md bg-card px-4 py-3 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.28)] ring-1 ring-border dark:ring-border">
              <button
                onClick={() => setShowNudge(false)}
                className="absolute right-2 top-2 cursor-pointer rounded-full p-0.5 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <p className="pr-4 text-[13px] font-semibold text-zinc-900 dark:text-zinc-50">
                New in Munich?
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                {chatbotConfig.name} is here to help you settle in.
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            toggleOpen();
            setShowNudge(false);
          }}
          className={cn(
            "group relative flex cursor-pointer items-center justify-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "shadow-[0_10px_30px_-8px_rgb(0_0_0/0.35)] active:scale-95",
            isOpen
              ? "h-12 w-12 bg-foreground text-background hover:scale-105"
              : "h-14 w-14 hover:scale-110"
          )}
          aria-label={isOpen ? "Close chat" : "Open AI assistant"}
        >
          {isOpen ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <>
              <Image
                src={chatbotConfig.avatar}
                alt=""
                width={112}
                height={112}
                sizes="56px"
                className={cn("h-14 w-14 rounded-full object-cover ring-2", accent.ring)}
              />
              <span
                className={cn(
                  "absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-card",
                  accent.acc
                )}
              >
                <MessageCircle className="h-3 w-3" />
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
