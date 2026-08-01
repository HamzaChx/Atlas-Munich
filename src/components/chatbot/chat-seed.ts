// ============================================
// Atlas Munich – seeding a chat from elsewhere
//
// Two ways to arrive at a dedicated chat with something already to say:
//
//   ?q=<prompt>   short, deep-linkable, shareable. Used by the intent chips
//                 and the "Try asking" lists.
//   pending slot  for pasted listings, which routinely run past the practical
//                 URL length limit and have no business in a query string.
//
// The pending slot is per-bot and read-once, so a paste destined for Riad
// can't leak into Dalilah's thread and can't replay on a refresh.
// ============================================

import type { ChatbotType } from "@/chatbot/types";

/** Sibling of STORAGE_PREFIX in use-chatbot.ts, which owns the thread itself. */
const PENDING_PREFIX = "atlas-chat:pending:";

export function setPendingMessage(chatbot: ChatbotType, text: string): void {
  if (typeof window === "undefined") return;
  const trimmed = text.trim();
  if (!trimmed) return;
  try {
    window.sessionStorage.setItem(PENDING_PREFIX + chatbot, trimmed);
  } catch {
    // sessionStorage unavailable (private mode, quota) — the navigation still
    // happens, the user just lands on an empty composer.
  }
}

/** Reads *and* clears, so the same paste can never be sent twice. */
export function takePendingMessage(chatbot: ChatbotType): string | null {
  if (typeof window === "undefined") return null;
  try {
    const key = PENDING_PREFIX + chatbot;
    const value = window.sessionStorage.getItem(key);
    if (value) window.sessionStorage.removeItem(key);
    return value?.trim() || null;
  } catch {
    return null;
  }
}
