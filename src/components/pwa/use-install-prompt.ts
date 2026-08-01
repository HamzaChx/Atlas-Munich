"use client";

// ============================================
// Atlas Munich – install prompt plumbing
//
// `beforeinstallprompt` fires once, on window, and the event is only usable
// while it's alive. Two places want it (the banner and the More sheet), so it
// is captured once into a module-level store and subscribed to from there
// rather than raced for by two components' effects.
// ============================================

import * as React from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredEvent: BeforeInstallPromptEvent | null = null;
let listening = false;
const subscribers = new Set<() => void>();

function emit() {
  subscribers.forEach((fn) => fn());
}

function startListening() {
  if (listening || typeof window === "undefined") return;
  listening = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    // Chrome shows its own mini-infobar unless the event is preempted.
    event.preventDefault();
    deferredEvent = event as BeforeInstallPromptEvent;
    emit();
  });

  window.addEventListener("appinstalled", () => {
    deferredEvent = null;
    emit();
  });
}

const VISITS_KEY = "atlas-visit-count";
const DISMISSED_KEY = "atlas-install-dismissed";

/** Bumped once per page load; the banner waits for the second visit. */
export function recordVisit(): number {
  if (typeof window === "undefined") return 0;
  const next = Number(localStorage.getItem(VISITS_KEY) ?? "0") + 1;
  localStorage.setItem(VISITS_KEY, String(next));
  return next;
}

export function useInstallPrompt() {
  const [canInstall, setCanInstall] = React.useState(false);

  React.useEffect(() => {
    startListening();
    const sync = () => setCanInstall(deferredEvent !== null);
    subscribers.add(sync);
    sync();
    return () => {
      subscribers.delete(sync);
    };
  }, []);

  const promptInstall = React.useCallback(async () => {
    const event = deferredEvent;
    if (!event) return "unavailable" as const;
    await event.prompt();
    const { outcome } = await event.userChoice;
    // The event is single-use: once prompted it can never be replayed.
    deferredEvent = null;
    emit();
    return outcome;
  }, []);

  return { canInstall, promptInstall };
}

export function isInstallDismissed() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(DISMISSED_KEY) === "true";
}

export function dismissInstall() {
  localStorage.setItem(DISMISSED_KEY, "true");
}
