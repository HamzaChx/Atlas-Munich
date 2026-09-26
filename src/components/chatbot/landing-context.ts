"use client";

// ============================================
// Atlas Munich – landing <-> chat bridge
//
// A dedicated chat can swap its empty state for a custom landing (Zellija's
// "Chno darrek?" page). The landing is handed over as an element from a
// server page, so it can't receive the chat's send function as a prop; it
// reads it from here instead.
// ============================================

import { createContext, useContext } from "react";

export interface LandingBridge {
  /** Starts the conversation in this chat, morphing the landing into it. */
  send: (text: string) => void;
}

export const LandingContext = createContext<LandingBridge | null>(null);

export function useLandingBridge(): LandingBridge {
  const bridge = useContext(LandingContext);
  if (!bridge) throw new Error("useLandingBridge must be used inside a DedicatedChat landing");
  return bridge;
}
