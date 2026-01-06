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
  ChatResponse,
  getChatbotForPath,
  CHATBOT_CONFIG,
  ChatbotNotification,
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
  sendMessage: (content: string) => Promise<void>;
  switchChatbot: (chatbot: ChatbotType) => void;
  clearMessages: () => void;
  toggleOpen: () => void;
  setIsOpen: (open: boolean) => void;
  dismissNotification: () => void;
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChatbot, setCurrentChatbot] = useState<ChatbotType>(getPageChatbot);
  const [notification, setNotification] = useState<ChatbotNotification | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Track the previous path to detect navigation
  const previousPathRef = useRef<string>(pathname);

  const abortControllerRef = useRef<AbortController | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

        const data: ChatResponse = await response.json();

        // Add assistant message
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
          chatbot: currentChatbot,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Handle navigation/routing (Zellija feature)
        if (data.navigation) {
          const fromChatbot = currentChatbot;
          const toChatbot = data.navigation.targetChatbot;

          // Show notification
          const notificationMessage = getHandoffMessage(fromChatbot, toChatbot, locale);
          setNotification({
            id: generateId(),
            message: notificationMessage,
            fromChatbot,
            toChatbot,
            duration: 5000,
          });

          // Clear notification after duration
          if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
          }
          notificationTimeoutRef.current = setTimeout(() => {
            setNotification(null);
          }, 5000);

          // Switch chatbot and navigate after a brief delay
          setTimeout(() => {
            setCurrentChatbot(toChatbot);
            // Use Next.js router for proper navigation
            router.push(data.navigation!.path);
          }, 1500);
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
    sendMessage,
    switchChatbot,
    clearMessages,
    toggleOpen,
    setIsOpen,
    dismissNotification,
  };
}

// Generate handoff message based on chatbots
function getHandoffMessage(from: ChatbotType, to: ChatbotType, locale: string): string {
  const toConfig = CHATBOT_CONFIG[to];

  const messages: Record<string, Record<ChatbotType, string>> = {
    en: {
      zellija: `Handing off to ${toConfig.name}...`,
      hamid: `I'll let Hamid help you with the guides! He's our expert 📚`,
      jmila: `Jmila will take it from here! She knows all the best spots 🐪`,
      hamza: `Let me connect you with Hamza, our developer 👨‍💻`,
    },
    fr: {
      zellija: `Je passe le relais à ${toConfig.name}...`,
      hamid: `Je laisse Hamid t'aider avec les guides! C'est notre expert 📚`,
      jmila: `Jmila prend le relais! Elle connaît tous les bons endroits 🐪`,
      hamza: `Je te mets en contact avec Hamza, notre développeur 👨‍💻`,
    },
    de: {
      zellija: `Ich übergebe an ${toConfig.name}...`,
      hamid: `Hamid wird dir bei den Guides helfen! Er ist unser Experte 📚`,
      jmila: `Jmila übernimmt! Sie kennt alle besten Orte 🐪`,
      hamza: `Ich verbinde dich mit Hamza, unserem Entwickler 👨‍💻`,
    },
  };

  return messages[locale]?.[to] || messages.en[to];
}
