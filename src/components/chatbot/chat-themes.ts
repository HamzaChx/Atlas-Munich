// ============================================
// Atlas Munich – Dedicated Chat Themes
// Plain module (no "use client") so both server
// components and client components can import safely.
// ============================================

import type { ChatbotType } from "@/chatbot/types";

export interface DedicatedChatTheme {
  chatbotType: ChatbotType;
  /** Header gradient – applied as bg-gradient-to-r */
  headerGradient: string;
  /** User bubble gradient classes */
  userBubble: string;
  /** Send button active classes (gradient + shadow) */
  sendButton: string;
  /** Input focus ring / border classes */
  inputRing: string;
  /** Suggestion chip hover classes */
  suggestionHover: string;
  /** Link text color in bot messages */
  linkColor: string;
  /** Thin ring around avatar */
  avatarRing: string;
  /** Online presence dot color */
  onlineDot: string;
  /** Gradient bg behind welcome avatar */
  welcomeGlow: string;
}

export const CHAT_THEMES = {
  healthcare: {
    chatbotType: "loubna" as const,
    headerGradient:
      "from-rose-600 via-red-500 to-rose-700 dark:from-rose-700 dark:via-red-600 dark:to-rose-800",
    userBubble: "from-rose-500 to-red-500",
    sendButton: "from-rose-500 to-red-600 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40",
    inputRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20",
    suggestionHover:
      "hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-700 dark:hover:text-rose-300 hover:border-rose-300 dark:hover:border-rose-700",
    linkColor: "text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300",
    avatarRing: "ring-2 ring-rose-200 dark:ring-rose-800/60",
    onlineDot: "bg-rose-300",
    welcomeGlow: "from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30",
  },
  housing: {
    chatbotType: "riad" as const,
    headerGradient:
      "from-sky-600 via-blue-600 to-sky-700 dark:from-sky-700 dark:via-blue-700 dark:to-sky-800",
    userBubble: "from-sky-500 to-blue-500",
    sendButton: "from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40",
    inputRing: "focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20",
    suggestionHover:
      "hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-700 dark:hover:text-sky-300 hover:border-sky-300 dark:hover:border-sky-700",
    linkColor: "text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300",
    avatarRing: "ring-2 ring-sky-200 dark:ring-sky-800/60",
    onlineDot: "bg-sky-300",
    welcomeGlow: "from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30",
  },
  bureaucracy: {
    chatbotType: "dalilah" as const,
    headerGradient:
      "from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-700 dark:via-teal-700 dark:to-emerald-800",
    userBubble: "from-emerald-500 to-teal-500",
    sendButton:
      "from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40",
    inputRing: "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20",
    suggestionHover:
      "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-700",
    linkColor:
      "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300",
    avatarRing: "ring-2 ring-emerald-200 dark:ring-emerald-800/60",
    onlineDot: "bg-emerald-300",
    welcomeGlow: "from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30",
  },
  academic: {
    chatbotType: "ilham" as const,
    headerGradient:
      "from-indigo-600 via-violet-600 to-indigo-700 dark:from-indigo-700 dark:via-violet-700 dark:to-indigo-800",
    userBubble: "from-indigo-500 to-violet-500",
    sendButton:
      "from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40",
    inputRing: "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20",
    suggestionHover:
      "hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700",
    linkColor:
      "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300",
    avatarRing: "ring-2 ring-indigo-200 dark:ring-indigo-800/60",
    onlineDot: "bg-indigo-300",
    welcomeGlow: "from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30",
  },
} satisfies Record<string, DedicatedChatTheme>;
