"use client";

// ============================================
// Atlas Munich Chatbot - React Hook
// ============================================

import { useState, useCallback, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { track } from "@vercel/analytics";
import {
  ChatMessage,
  ChatbotType,
  getChatbotForPath,
  CHATBOT_CONFIG,
  ChatbotNotification,
  RedirectCountdown,
} from "./types";

interface UseChatbotOptions {
  initialChatbot?: ChatbotType;
}

interface UseChatbotReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentChatbot: ChatbotType;
  chatbotConfig: (typeof CHATBOT_CONFIG)[ChatbotType];
  notification: ChatbotNotification | null;
  isOpen: boolean;
  redirectCountdown: RedirectCountdown | null;
  showSuccessNotification: boolean;
  sendMessage: (content: string) => Promise<void>;
  switchChatbot: (chatbot: ChatbotType) => void;
  clearMessages: () => void;
  toggleOpen: () => void;
  setIsOpen: (open: boolean) => void;
  dismissNotification: () => void;
  cancelRedirect: () => void;
  goNow: () => void;
  dismissSuccessNotification: () => void;
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Countdown duration in seconds — short enough that it doesn't eat the
// conversation the user just had, since history now carries across the hop.
const REDIRECT_COUNTDOWN_SECONDS = 5;

// Per-bot conversation history, kept for the tab's lifetime so a page
// navigation (including the handoff redirect itself) doesn't wipe it.
const STORAGE_PREFIX = "atlas-chat:";

function loadStoredMessages(chatbot: ChatbotType): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_PREFIX + chatbot);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Omit<ChatMessage, "timestamp"> & { timestamp: string }>;
    return parsed.map((msg) => ({ ...msg, timestamp: new Date(msg.timestamp) }));
  } catch {
    return [];
  }
}

function saveStoredMessages(chatbot: ChatbotType, messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    if (messages.length === 0) {
      window.sessionStorage.removeItem(STORAGE_PREFIX + chatbot);
    } else {
      window.sessionStorage.setItem(STORAGE_PREFIX + chatbot, JSON.stringify(messages));
    }
  } catch {
    // sessionStorage unavailable (private mode, quota) — degrade to in-memory only.
  }
}

export function useChatbot(options: UseChatbotOptions = {}): UseChatbotReturn {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  // Determine chatbot based on current path
  const getPageChatbot = useCallback((): ChatbotType => {
    if (options.initialChatbot) return options.initialChatbot;
    return getChatbotForPath(pathname);
  }, [pathname, options.initialChatbot]);

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadStoredMessages(getPageChatbot())
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChatbot, setCurrentChatbot] = useState<ChatbotType>(getPageChatbot);
  const [notification, setNotification] = useState<ChatbotNotification | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<RedirectCountdown | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Track the previous path to detect navigation
  const previousPathRef = useRef<string>(pathname);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wasRedirectedRef = useRef<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Show success notification when landing after redirect
  useEffect(() => {
    if (wasRedirectedRef.current && previousPathRef.current !== pathname) {
      wasRedirectedRef.current = false;
      setShowSuccessNotification(true);
      // Auto-hide after 4 seconds
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 4000);
    }
  }, [pathname]);

  // Persist the active bot's thread as it grows, so a page navigation (or a
  // tab reload) doesn't lose it.
  useEffect(() => {
    saveStoredMessages(currentChatbot, messages);
  }, [currentChatbot, messages]);

  // When path changes, switch to the new page's chatbot and load *that
  // bot's* saved thread instead of wiping it — a handoff seeds this via
  // saveStoredMessages(toChatbot, ...) below, so context carries over.
  useEffect(() => {
    const newChatbot = getPageChatbot();

    // Only trigger if the path actually changed (not on initial mount)
    if (previousPathRef.current !== pathname) {
      previousPathRef.current = pathname;

      setCurrentChatbot(newChatbot);
      setMessages(loadStoredMessages(newChatbot));
      setError(null);
    }
  }, [pathname, getPageChatbot]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Add user message
      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
        chatbot: currentChatbot,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      // Tracked outside the try so a failed stream can clean up its placeholder
      let assistantId: string | null = null;

      try {
        // Prepare messages for API
        const apiMessages = [...messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: apiMessages,
            chatbotType: currentChatbot,
            locale,
            currentPath: pathname,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        // Add placeholder assistant message and stream chunks into it
        assistantId = generateId();
        const assistantMessage: ChatMessage = {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          chatbot: currentChatbot,
          isStreaming: true,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        let firstChunk = true;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;

          // Hide loading spinner after first bytes arrive
          if (firstChunk) {
            firstChunk = false;
            setIsLoading(false);
          }

          // Render incrementally, stripping any route markers from display
          const displayText = fullText.replace(/\[ROUTE:[^\]]+\]/g, "").trim();
          setMessages((prev) =>
            prev.map((msg) => (msg.id === assistantId ? { ...msg, content: displayText } : msg))
          );
        }

        // After stream ends, parse for routing instructions (Zellija feature)
        const routeMatch = fullText.match(/\[ROUTE:([^\]:]+):([^\]]+)\]/);
        const cleanResponse = fullText.replace(/\[ROUTE:[^\]]+\]/g, "").trim();

        // Ensure final clean content is set
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: cleanResponse, isStreaming: false } : msg
          )
        );

        // Handle navigation/routing if present
        if (routeMatch) {
          const targetPath = routeMatch[1];
          const toChatbot = routeMatch[2] as ChatbotType;
          const toConfig = CHATBOT_CONFIG[toChatbot];

          track("chat_handoff", { from: currentChatbot, to: toChatbot });

          // Seed the target bot's thread with this conversation so the
          // handoff carries context instead of dropping the user into a
          // blank chat when the redirect navigates.
          const finalAssistantMessage: ChatMessage = {
            id: assistantId,
            role: "assistant",
            content: cleanResponse,
            timestamp: new Date(),
            chatbot: currentChatbot,
            isStreaming: false,
          };
          saveStoredMessages(toChatbot, [...messages, userMessage, finalAssistantMessage]);

          setRedirectCountdown({
            isActive: true,
            secondsRemaining: REDIRECT_COUNTDOWN_SECONDS,
            targetPath,
            targetChatbot: toChatbot,
            message: `Redirecting to ${toConfig.name} in`,
          });

          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }

          let secondsLeft = REDIRECT_COUNTDOWN_SECONDS;
          countdownIntervalRef.current = setInterval(() => {
            secondsLeft -= 1;

            if (secondsLeft <= 0) {
              if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
              }
              wasRedirectedRef.current = true;
              setRedirectCountdown(null);
              setCurrentChatbot(toChatbot);
              router.push(targetPath);
            } else {
              setRedirectCountdown((prev) =>
                prev ? { ...prev, secondsRemaining: secondsLeft } : null
              );
            }
          }, 1000);
        }
      } catch (err) {
        const cancelled = err instanceof Error && err.name === "AbortError";

        // A half-written or empty bubble is worse than none: drop it if nothing
        // arrived, otherwise keep what the user already read and stop the caret.
        if (assistantId) {
          const id = assistantId;
          setMessages((prev) =>
            prev
              .filter((msg) => !(msg.id === id && msg.content.trim() === ""))
              .map((msg) => (msg.id === id ? { ...msg, isStreaming: false } : msg))
          );
        }

        if (cancelled) return; // Request was cancelled
        setError("Failed to send message. Please try again.");
        console.error("Chat error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, currentChatbot, locale, pathname, isLoading, router]
  );

  // Cancel redirect
  const cancelRedirect = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setRedirectCountdown(null);
  }, []);

  // Skip the wait and navigate immediately
  const goNow = useCallback(() => {
    setRedirectCountdown((prev) => {
      if (!prev) return prev;
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      wasRedirectedRef.current = true;
      setCurrentChatbot(prev.targetChatbot);
      router.push(prev.targetPath);
      return null;
    });
  }, [router]);

  // Dismiss success notification
  const dismissSuccessNotification = useCallback(() => {
    setShowSuccessNotification(false);
  }, []);

  const switchChatbot = useCallback((chatbot: ChatbotType) => {
    setCurrentChatbot(chatbot);
    // Optionally clear messages when switching
    // setMessages([]);
  }, []);

  const clearMessages = useCallback(() => {
    saveStoredMessages(currentChatbot, []);
    setMessages([]);
    setError(null);
    // Reset to current page's chatbot when clearing
    const pageBot = getChatbotForPath(pathname);
    setCurrentChatbot(pageBot);
  }, [pathname, currentChatbot]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) track("chat_open", { chatbot: currentChatbot });
      return next;
    });
  }, [currentChatbot]);

  const trackedSetIsOpen = useCallback(
    (open: boolean) => {
      if (open) track("chat_open", { chatbot: currentChatbot });
      setIsOpen(open);
    },
    [currentChatbot]
  );

  const dismissNotification = useCallback(() => {
    setNotification(null);
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    currentChatbot,
    chatbotConfig: CHATBOT_CONFIG[currentChatbot],
    notification,
    isOpen,
    redirectCountdown,
    showSuccessNotification,
    sendMessage,
    switchChatbot,
    clearMessages,
    toggleOpen,
    setIsOpen: trackedSetIsOpen,
    dismissNotification,
    cancelRedirect,
    goNow,
    dismissSuccessNotification,
  };
}
