"use client";

// ============================================
// Atlas Munich Chatbot - React Hook
// ============================================

import { useState, useCallback, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { track } from "@vercel/analytics";
import {
  readUIMessageStream,
  parseJsonEventStream,
  uiMessageChunkSchema,
  isToolUIPart,
  getToolName,
  type UIMessage,
  type UIMessageChunk,
  type UIMessagePart,
  type UIDataTypes,
  type UITools,
} from "ai";
import {
  ChatBlock,
  ChatMessage,
  ChatbotType,
  getChatbotForPath,
  CHATBOT_CONFIG,
  ChatbotNotification,
} from "./types";
import { setPendingMessage } from "@/components/chatbot/chat-seed";
import { getDeclinedHandoffs, addDeclinedHandoff } from "./declined-handoffs";
import type { ProposeHandoffInput, CiteGuideInput, RequestLocationInput } from "./tools";
import { assistants } from "@/data/assistants";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { Place } from "@/types";

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
  showSuccessNotification: boolean;
  sendMessage: (content: string) => Promise<void>;
  switchChatbot: (chatbot: ChatbotType) => void;
  clearMessages: () => void;
  toggleOpen: () => void;
  setIsOpen: (open: boolean) => void;
  dismissNotification: () => void;
  dismissSuccessNotification: () => void;
  confirmHandoff: (messageId: string) => void;
  denyHandoff: (messageId: string) => void;
  confirmLocationRequest: (messageId: string) => void;
  denyLocationRequest: (messageId: string) => void;
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Per-bot conversation history, kept across visits on this device so closing
// the tab (or coming back tomorrow) doesn't lose it.
const STORAGE_PREFIX = "atlas-chat:";

function loadStoredMessages(chatbot: ChatbotType): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + chatbot);
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
      window.localStorage.removeItem(STORAGE_PREFIX + chatbot);
    } else {
      window.localStorage.setItem(STORAGE_PREFIX + chatbot, JSON.stringify(messages));
    }
  } catch {
    // localStorage unavailable (private mode, quota) — degrade to in-memory only.
  }
}

/** A block list collapsed back to plain text, for the outgoing conversation
    history (and for "copy message") — a text transcript, not our rendering
    structure. */
export function blocksToText(blocks: ChatBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "text":
          return block.text;
        case "handoff-to-specialized-agent":
          return `[Proposed connecting the user with ${block.chatbot}: ${block.reason}]`;
        case "guide-citation":
          return `[Cited guide: ${block.title}]`;
        case "map-result":
          return `[Showed ${block.places.length} places on a map]`;
        case "display-whatsapp-qr":
          return "[Suggested joining the WhatsApp community]";
        case "request-location":
          return `[Asked to use the user's location: ${block.reason}]`;
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}

/** Turns the AI SDK's message parts into our own block shape. Recomputed
    fresh from the full part list on every update, so it's safe to call
    repeatedly while a message is still streaming. */
function partsToBlocks(parts: UIMessagePart<UIDataTypes, UITools>[]): ChatBlock[] {
  const blocks: ChatBlock[] = [];

  for (const part of parts) {
    if (part.type === "text") {
      if (part.text) blocks.push({ type: "text", text: part.text });
      continue;
    }

    if (!isToolUIPart(part)) continue;
    // Only a fully-formed input is safe to render — while streaming, partial
    // JSON args can be malformed.
    if (part.state !== "input-available" && part.state !== "output-available") continue;

    const toolName = getToolName(part);

    if (toolName === "proposeHandoff") {
      const input = part.input as Partial<ProposeHandoffInput> | undefined;
      if (input?.chatbot && input?.reason) {
        blocks.push({
          type: "handoff-to-specialized-agent",
          chatbot: input.chatbot,
          reason: input.reason,
          status: "pending",
        });
      }
      continue;
    }

    if (toolName === "citeGuide") {
      const input = part.input as Partial<CiteGuideInput> | undefined;
      if (input?.slug && input?.title && input?.summary) {
        blocks.push({
          type: "guide-citation",
          slug: input.slug,
          title: input.title,
          summary: input.summary,
        });
      }
      continue;
    }

    if (toolName === "showWhatsAppFallback") {
      blocks.push({ type: "display-whatsapp-qr", reason: "zero-confidence" });
      continue;
    }

    if (toolName === "requestLocation") {
      const input = part.input as Partial<RequestLocationInput> | undefined;
      if (input?.reason) {
        blocks.push({ type: "request-location", reason: input.reason, status: "pending" });
      }
      continue;
    }

    if (toolName === "searchPlaces") {
      // Only meaningful once the server-side lookup has actually run.
      if (part.state !== "output-available") continue;
      const output = part.output as { places?: Place[] } | undefined;
      if (output?.places && output.places.length > 0) {
        blocks.push({ type: "map-result", places: output.places });
      }
      continue;
    }

    // searchGuidesAndFaqs grounds the model's own text — it has no block of
    // its own, so it's intentionally not handled here.
  }

  return blocks;
}

/** A short, named status for a tool call that hasn't resolved yet — shown in
    place of an empty bubble instead of a bare spinner. Only the tools with a
    real server-side lookup have a meaningful "in progress" phase; the
    client-resolved ones (proposeHandoff, citeGuide, showWhatsAppFallback)
    resolve instantly, so they're not covered here. */
function statusLabelFromParts(parts: UIMessagePart<UIDataTypes, UITools>[]): string | undefined {
  for (const part of parts) {
    if (!isToolUIPart(part) || part.state === "output-available") continue;
    const toolName = getToolName(part);
    if (toolName === "searchGuidesAndFaqs") return "Looking through guides…";
    if (toolName === "searchPlaces") return "Checking the map with Jmila…";
  }
  return undefined;
}

/** Adapts the response body (a JSON event / SSE stream) into the plain
    `ReadableStream<UIMessageChunk>` `readUIMessageStream` expects. */
function toUIMessageChunkStream(body: ReadableStream<Uint8Array>): ReadableStream<UIMessageChunk> {
  const parsed = parseJsonEventStream({ stream: body, schema: uiMessageChunkSchema });
  const reader = parsed.getReader();
  return new ReadableStream<UIMessageChunk>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      if (value.success) controller.enqueue(value.value);
      else controller.error(value.error);
    },
    cancel() {
      reader.releaseLock();
    },
  });
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
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [declinedHandoffs, setDeclinedHandoffs] = useState<ChatbotType[]>(getDeclinedHandoffs);
  const geolocation = useGeolocation();

  // Track the previous path to detect navigation
  const previousPathRef = useRef<string>(pathname);
  const wasRedirectedRef = useRef<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Set while waiting on the browser's own permission prompt after the user
  // clicked "Share location" on a request-location card, so the async result
  // (granted, denied, or errored) can be traced back to that specific card.
  const pendingLocationMessageIdRef = useRef<string | null>(null);

  // Show success notification when landing after a confirmed handoff
  useEffect(() => {
    if (wasRedirectedRef.current && previousPathRef.current !== pathname) {
      wasRedirectedRef.current = false;
      setShowSuccessNotification(true);
      const timer = setTimeout(() => setShowSuccessNotification(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Persist the active bot's thread as it grows, so a page navigation (or a
  // tab reload, or coming back tomorrow) doesn't lose it.
  useEffect(() => {
    saveStoredMessages(currentChatbot, messages);
  }, [currentChatbot, messages]);

  // When path changes, switch to the new page's chatbot and load *that
  // bot's* saved thread instead of wiping it — a confirmed handoff seeds this
  // via setPendingMessage below, so context carries over.
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

  // Cleanup on unmount. Deliberately doesn't abort an in-flight
  // abortControllerRef request here: React Strict Mode fake-unmounts every
  // component once on initial mount in dev, and a request kicked off by the
  // very same mount (e.g. the pending-handoff auto-send below) would get
  // silently cancelled before it could ever resolve. React 18 already no-ops
  // state updates on a truly unmounted component, so skipping the abort costs
  // nothing but an occasional wasted response.
  useEffect(() => {
    return () => {
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
        blocks: [{ type: "text", text: content.trim() }],
        timestamp: new Date(),
        chatbot: currentChatbot,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      // Tracked outside the try so a failed stream can clean up its placeholder
      let assistantId: string | null = null;

      try {
        const apiMessages = [...messages, userMessage].map((msg) => ({
          role: msg.role,
          content: blocksToText(msg.blocks),
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
            declinedHandoffs,
            userLocation: geolocation.coords ?? undefined,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error("Failed to get response");
        }

        // Add placeholder assistant message and fill it in as parts arrive
        assistantId = generateId();
        const id = assistantId;
        const assistantMessage: ChatMessage = {
          id,
          role: "assistant",
          blocks: [],
          timestamp: new Date(),
          chatbot: currentChatbot,
          isStreaming: true,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        const chunkStream = toUIMessageChunkStream(response.body);

        let firstUpdate = true;
        for await (const uiMessage of readUIMessageStream<UIMessage>({ stream: chunkStream })) {
          if (firstUpdate) {
            firstUpdate = false;
            setIsLoading(false);
          }
          const blocks = partsToBlocks(uiMessage.parts);
          const statusLabel =
            blocks.length === 0 ? statusLabelFromParts(uiMessage.parts) : undefined;
          setMessages((prev) =>
            prev.map((msg) => (msg.id === id ? { ...msg, blocks, statusLabel } : msg))
          );
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id ? { ...msg, isStreaming: false, statusLabel: undefined } : msg
          )
        );
      } catch (err) {
        const cancelled = err instanceof Error && err.name === "AbortError";

        // A half-written or empty bubble is worse than none: drop it if nothing
        // arrived, otherwise keep what the user already read and stop the caret.
        if (assistantId) {
          const id = assistantId;
          setMessages((prev) =>
            prev
              .filter((msg) => !(msg.id === id && msg.blocks.length === 0))
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
    [messages, currentChatbot, locale, pathname, isLoading, declinedHandoffs, geolocation.coords]
  );

  /** Finds the (single) request-location block in a message and applies an updater to it. */
  const updateLocationBlock = useCallback(
    (
      messageId: string,
      apply: (block: Extract<ChatBlock, { type: "request-location" }>) => ChatBlock
    ) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;
          return {
            ...msg,
            blocks: msg.blocks.map((block) =>
              block.type === "request-location" ? apply(block) : block
            ),
          };
        })
      );
    },
    []
  );

  const confirmLocationRequest = useCallback(
    (messageId: string) => {
      pendingLocationMessageIdRef.current = messageId;
      track("chat_location_requested", { chatbot: currentChatbot });
      geolocation.request();
    },
    [currentChatbot, geolocation]
  );

  const denyLocationRequest = useCallback(
    (messageId: string) => {
      updateLocationBlock(messageId, (block) => ({ ...block, status: "denied" }));
      track("chat_location_declined", { chatbot: currentChatbot });
    },
    [currentChatbot, updateLocationBlock]
  );

  // Reacts to the browser's own permission result once confirmLocationRequest
  // has fired it. A granted position re-sends the conversation's next turn
  // automatically (as a normal, visible user message) so the model can retry
  // searchPlaces now that coordinates exist — nothing here fabricates a
  // hidden message or calls the tool directly.
  useEffect(() => {
    const messageId = pendingLocationMessageIdRef.current;
    if (!messageId || geolocation.status === "locating" || geolocation.status === "idle") return;

    pendingLocationMessageIdRef.current = null;

    if (geolocation.status === "granted") {
      updateLocationBlock(messageId, (block) => ({ ...block, status: "granted" }));
      sendMessage("Use my current location");
    } else {
      updateLocationBlock(messageId, (block) => ({ ...block, status: "denied" }));
    }
    // sendMessage is intentionally omitted: including it would re-run this
    // effect (and risk a duplicate send) on every keystroke-driven identity
    // change. geolocation.status is the only signal this effect should react to.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geolocation.status, updateLocationBlock]);

  /** Finds the (single) handoff block in a message and applies an updater to it. */
  const updateHandoffBlock = useCallback(
    (
      messageId: string,
      apply: (block: Extract<ChatBlock, { type: "handoff-to-specialized-agent" }>) => ChatBlock
    ) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;
          return {
            ...msg,
            blocks: msg.blocks.map((block) =>
              block.type === "handoff-to-specialized-agent" ? apply(block) : block
            ),
          };
        })
      );
    },
    []
  );

  const confirmHandoff = useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m.id === messageId);
      const handoff = message?.blocks.find(
        (b): b is Extract<ChatBlock, { type: "handoff-to-specialized-agent" }> =>
          b.type === "handoff-to-specialized-agent"
      );
      if (!handoff) return;

      updateHandoffBlock(messageId, (block) => ({ ...block, status: "confirmed" }));
      track("chat_handoff", { from: currentChatbot, to: handoff.chatbot });

      setPendingMessage(handoff.chatbot, `(Continuing from Zellija) ${handoff.reason}`);

      const targetPath = assistants.find((a) => a.chatbot === handoff.chatbot)?.chatPath;
      if (!targetPath) return;
      wasRedirectedRef.current = true;
      setCurrentChatbot(handoff.chatbot);
      router.push(targetPath);
    },
    [messages, currentChatbot, router, updateHandoffBlock]
  );

  const denyHandoff = useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m.id === messageId);
      const handoff = message?.blocks.find(
        (b): b is Extract<ChatBlock, { type: "handoff-to-specialized-agent" }> =>
          b.type === "handoff-to-specialized-agent"
      );
      if (!handoff) return;

      updateHandoffBlock(messageId, (block) => ({ ...block, status: "declined" }));
      track("chat_handoff_declined", { from: currentChatbot, to: handoff.chatbot });
      setDeclinedHandoffs(addDeclinedHandoff(handoff.chatbot));
    },
    [messages, currentChatbot, updateHandoffBlock]
  );

  // Dismiss success notification
  const dismissSuccessNotification = useCallback(() => {
    setShowSuccessNotification(false);
  }, []);

  const switchChatbot = useCallback((chatbot: ChatbotType) => {
    setCurrentChatbot(chatbot);
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
    showSuccessNotification,
    sendMessage,
    switchChatbot,
    clearMessages,
    toggleOpen,
    setIsOpen: trackedSetIsOpen,
    dismissNotification,
    dismissSuccessNotification,
    confirmHandoff,
    denyHandoff,
    confirmLocationRequest,
    denyLocationRequest,
  };
}
