// ============================================
// Atlas Munich – declined handoffs
//
// Which specialists the reader has already said "no thanks" to, so Zellija
// doesn't keep re-proposing the same one. Device-local and persists across
// visits, same rationale as the chat threads themselves (see use-chatbot.ts).
// ============================================

import type { ChatbotType } from "./types";

const STORAGE_KEY = "atlas-chat:declined-handoffs";

export function getDeclinedHandoffs(): ChatbotType[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Returns the updated list, so the caller can put it straight into state. */
export function addDeclinedHandoff(chatbot: ChatbotType): ChatbotType[] {
  const current = getDeclinedHandoffs();
  if (current.includes(chatbot)) return current;
  const next = [...current, chatbot];
  if (typeof window === "undefined") return next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private mode, quota) — the in-memory value
    // returned above still works for the rest of this session.
  }
  return next;
}
