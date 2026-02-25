"use client";

// ============================================
// Atlas Munich Chatbot - React Hook
// ============================================

import { useState, useCallback, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
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
  dismissSuccessNotification: () => void;
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Countdown duration in seconds
const REDIRECT_COUNTDOWN_SECONDS = 15;

export function useChatbot(options: UseChatbotOptions = {}): UseChatbotReturn {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  // Determine chatbot based on current path
  const getPageChatbot = useCallback((): ChatbotType => {
    if (options.initialChatbot) return options.initialChatbot;
    return getChatbotForPath(pathname);
  }, [pathname, options.initialChatbot]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

  // When path changes, clear messages and switch to the new page's chatbot
  useEffect(() => {
    const newChatbot = getPageChatbot();

    // Only trigger if the path actually changed (not on initial mount)
    if (previousPathRef.current !== pathname) {
      previousPathRef.current = pathname;

      // Clear messages and switch to new chatbot
      setMessages([]);
      setCurrentChatbot(newChatbot);
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
        const assistantId = generateId();
        const assistantMessage: ChatMessage = {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          chatbot: currentChatbot,
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
          prev.map((msg) => (msg.id === assistantId ? { ...msg, content: cleanResponse } : msg))
        );

        // Handle navigation/routing if present
        if (routeMatch) {
          const targetPath = routeMatch[1];
          const toChatbot = routeMatch[2] as ChatbotType;
          const toConfig = CHATBOT_CONFIG[toChatbot];

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
        if (err instanceof Error && err.name === "AbortError") {
          return; // Request was cancelled
        }
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
    setMessages([]);
    setError(null);
    // Reset to current page's chatbot when clearing
    const pageBot = getChatbotForPath(pathname);
    setCurrentChatbot(pageBot);
  }, [pathname]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

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
    setIsOpen,
    dismissNotification,
    cancelRedirect,
    dismissSuccessNotification,
  };
}

// Generate handoff message based on chatbots (keeping for future use)
function _getHandoffMessage(from: ChatbotType, to: ChatbotType, locale: string): string {
  const toConfig = CHATBOT_CONFIG[to];

  const messages: Record<string, Record<ChatbotType, string>> = {
    en: {
      zellija: `Handing off to ${toConfig.name}...`,
      hamid: `I'll let Hamid help you with the guides! He's our expert 📚`,
      jmila: `Jmila will take it from here! She knows all the best spots 🐪`,
      hamza: `Let me connect you with Hamza, our developer 👨‍💻`,
      riad: `Passing you to Riad, he'll write you a winning Munich rental application! 🏠`,
    },
    fr: {
      zellija: `Je passe le relais à ${toConfig.name}...`,
      hamid: `Je laisse Hamid t'aider avec les guides! C'est notre expert 📚`,
      jmila: `Jmila prend le relais! Elle connaît tous les bons endroits 🐪`,
      hamza: `Je te mets en contact avec Hamza, notre développeur 👨‍💻`,
      riad: `Je te passe à Riad, il t'écrira une candidature gagnante pour Munich! 🏠`,
    },
    de: {
      zellija: `Ich übergebe an ${toConfig.name}...`,
      hamid: `Hamid wird dir bei den Guides helfen! Er ist unser Experte 📚`,
      jmila: `Jmila übernimmt! Sie kennt alle besten Orte 🐪`,
      hamza: `Ich verbinde dich mit Hamza, unserem Entwickler 👨‍💻`,
      riad: `Ich übergebe dich an Riad, er schreibt dir eine überzeugende Münchner Mietbewerbung! 🏠`,
    },
  };

  return messages[locale]?.[to] || messages.en[to];
}
