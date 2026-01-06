"use client";

// ============================================
// Atlas Munich Chatbot - Main UI Component
// Expandable/Collapsible Chat Box Overlay
// ============================================

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useChatbot } from "@/chatbot/use-chatbot";
import { ChatbotType } from "@/chatbot/types";
import { cn } from "@/lib/utils";
import { X, Send, Loader2, ChevronDown, RefreshCcw, Sparkles } from "lucide-react";

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
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="my-2 ml-4 list-disc space-y-1">
            {listItems.map((item, i) => (
              <li key={i} className="text-sm">
                {parseInlineFormatting(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    };

    lines.forEach((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={idx} className="text-base font-bold mt-3 mb-1">
            {parseInlineFormatting(line.replace("### ", ""))}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={idx} className="text-lg font-bold mt-3 mb-1">
            {parseInlineFormatting(line.replace("## ", ""))}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={idx} className="text-xl font-bold mt-3 mb-1">
            {parseInlineFormatting(line.replace("# ", ""))}
          </h1>
        );
      }
      // List items
      else if (line.match(/^[\-\*\•]\s/)) {
        inList = true;
        listItems.push(line.replace(/^[\-\*\•]\s/, ""));
      }
      // Numbered lists
      else if (line.match(/^\d+\.\s/)) {
        flushList();
        const content = line.replace(/^\d+\.\s/, "");
        elements.push(
          <p key={idx} className="my-1 text-sm">
            <span className="font-semibold">{line.match(/^\d+\./)?.[0]}</span>{" "}
            {parseInlineFormatting(content)}
          </p>
        );
      }
      // Empty line
      else if (line.trim() === "") {
        flushList();
        elements.push(<div key={idx} className="h-2" />);
      }
      // Regular paragraph (with potential inline formatting)
      else {
        if (!inList) {
          flushList();
          elements.push(
            <p key={idx} className="my-1 text-sm">
              {parseInlineFormatting(line)}
            </p>
          );
        } else {
          // Continue adding to list if we were in one
          listItems.push(line);
        }
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
    sendMessage,
    clearMessages,
    toggleOpen,
    setIsOpen,
    dismissNotification,
  } = useChatbot();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Don't render chatbot on FAQ page
  const isFaqPage = pathname === "/faq" || pathname.startsWith("/faq/");

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

  // Welcome message for empty state
  const welcomeMessages: Record<ChatbotType, string> = {
    zellija: "Salam! 👋 I'm Zellija, your guide to Atlas Munich. How can I help you today?",
    hamid:
      "Labas! 📚 I'm Hamid, your guides specialist. Ask me about housing, KVR, university, or anything Munich!",
    jmila:
      "Hey there! 🐪 I'm Jmila, and I know all the best spots in Munich. Looking for halal food or a nice café?",
    hamza: "Salam! 👨‍💻 I'm Hamza, the developer of Atlas Munich. Want to know about the project?",
  };

  // Don't render on FAQ page
  if (isFaqPage) {
    return null;
  }

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      <div
        className={cn(
          "w-[380px] max-w-[calc(100vw-3rem)] transition-all duration-500 ease-out",
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
        )}
        style={{
          position: "fixed",
          bottom: "7rem",
          right: "1.5rem",
          zIndex: 9999,
        }}
      >
        <div className="relative flex h-[480px] max-h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-900/20 dark:shadow-black/40 animate-in slide-in-from-bottom-4 duration-500">
          {/* Notification */}
          {notification && (
            <HandoffNotification message={notification.message} onDismiss={dismissNotification} />
          )}

          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 ring-2 ring-emerald-500/20">
                <Image
                  src={chatbotConfig.avatar}
                  alt={chatbotConfig.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {chatbotConfig.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{chatbotConfig.tagline}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={clearMessages}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                title="Clear chat"
              >
                <RefreshCcw className="h-4 w-4 transition-transform hover:rotate-180 duration-300" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                title="Minimize chat"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="relative h-20 w-20 mb-4 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 ring-4 ring-emerald-500/20">
                  <Image
                    src={chatbotConfig.avatar}
                    alt={chatbotConfig.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  {chatbotConfig.name}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  {welcomeMessages[currentChatbot]}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {getSuggestedQuestions(currentChatbot).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-700 border border-transparent transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
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
            className="border-t border-zinc-200 dark:border-zinc-800 p-4"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                style={{ maxHeight: "120px" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 cursor-pointer",
                  input.trim() && !isLoading
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-110 active:scale-95"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Action Button with Zellij Pattern */}
      <button
        onClick={toggleOpen}
        className={cn(
          "group relative overflow-hidden rounded-full shadow-2xl transition-all duration-500 ease-out cursor-pointer",
          isOpen
            ? "h-14 w-14 bg-white dark:bg-zinc-800 shadow-zinc-900/10 dark:shadow-black/40 hover:shadow-zinc-900/20 dark:hover:shadow-black/60 rotate-90"
            : "h-14 w-auto px-6 bg-gradient-to-br from-red-500 via-amber-500 to-green-600 shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-110 hover:rotate-2"
        )}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
        }}
        aria-label={isOpen ? "Close chat" : "Open AI assistant"}
      >
        {/* Zellij Pattern Overlay */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none",
            !isOpen && "group-hover:opacity-20"
          )}
        >
          <svg className="h-full w-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="zellij" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10,0 L20,10 L10,20 L0,10 Z" fill="white" opacity="0.3" />
                <circle cx="10" cy="10" r="3" fill="white" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#zellij)" />
          </svg>
        </div>

        {/* Shimmer Effect */}
        <div
          className={cn(
            "absolute inset-0 -translate-x-full transition-transform duration-1000 ease-out pointer-events-none",
            !isOpen && "group-hover:translate-x-full"
          )}
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
        </div>

        {/* Button Content */}
        <div className="relative flex items-center justify-center gap-2">
          {isOpen ? (
            <X className="h-6 w-6 text-zinc-700 dark:text-zinc-300 transition-transform duration-300 group-hover:rotate-90" />
          ) : (
            <>
              <svg
                className="h-5 w-5 text-white transition-all duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <circle cx="9" cy="10" r="1" fill="currentColor" />
                <circle cx="12" cy="10" r="1" fill="currentColor" />
                <circle cx="15" cy="10" r="1" fill="currentColor" />
              </svg>
              <span className="text-sm font-bold text-white whitespace-nowrap tracking-wide drop-shadow-lg">
                Chat
              </span>
            </>
          )}
        </div>

        {/* Pulse Ring on Hover (when closed) */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full border-2 border-white/50 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 pointer-events-none" />
        )}
      </button>
    </div>
  );
}

// Suggested questions per chatbot
function getSuggestedQuestions(chatbot: ChatbotType): string[] {
  const questions: Record<ChatbotType, string[]> = {
    zellija: ["What can you help me with?", "I need housing help", "Find halal food"],
    hamid: ["How do I do Anmeldung?", "Tips for finding an apartment", "What apps do I need?"],
    jmila: ["Best halal restaurants?", "Where can I study?", "Moroccan food spots"],
    hamza: ["About this project", "How can I contribute?", "Tech stack used?"],
  };

  return questions[chatbot] || questions.zellija;
}

export default Chatbot;
