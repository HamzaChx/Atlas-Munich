// ============================================
// Atlas Munich – Dedicated Chat Themes
// Premium design tokens for themed chat UIs
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
  /** Accent CSS color for dynamic styles (hex) */
  accentColor: string;
  /** Subtle BG mesh / gradient for the message area */
  meshGradient: string;
  /** Typing indicator dot colour */
  typingDot: string;
  /** Suggestion chip icon/accent classes */
  suggestionAccent: string;
  /** Scrollbar thumb color class */
  scrollThumb: string;
}

export const CHAT_THEMES = {
  healthcare: {
    chatbotType: "loubna" as const,
    headerGradient:
      "from-rose-600 via-pink-600 to-rose-700 dark:from-rose-700 dark:via-pink-700 dark:to-rose-800",
    userBubble: "from-rose-500 to-pink-600",
    sendButton:
      "from-rose-500 to-pink-600 shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/35",
    inputRing:
      "focus:border-rose-400/70 focus:ring-2 focus:ring-rose-500/15 dark:focus:border-rose-500/50 dark:focus:ring-rose-500/10",
    suggestionHover:
      "hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300 hover:border-rose-300/60 dark:hover:border-rose-500/20",
    linkColor:
      "text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300",
    avatarRing: "ring-2 ring-white/30",
    onlineDot: "bg-rose-400",
    welcomeGlow:
      "from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30",
    accentColor: "#e11d48",
    meshGradient:
      "bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,113,133,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,113,133,0.04),transparent)]",
    typingDot: "bg-rose-400 dark:bg-rose-500",
    suggestionAccent: "text-rose-500 dark:text-rose-400",
    scrollThumb: "bg-rose-200 dark:bg-rose-800/50",
  },
  housing: {
    chatbotType: "riad" as const,
    headerGradient:
      "from-amber-500 via-orange-600 to-amber-600 dark:from-amber-600 dark:via-orange-700 dark:to-amber-700",
    userBubble: "from-amber-500 to-orange-600",
    sendButton:
      "from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35",
    inputRing:
      "focus:border-amber-400/70 focus:ring-2 focus:ring-amber-500/15 dark:focus:border-amber-500/50 dark:focus:ring-amber-500/10",
    suggestionHover:
      "hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300 hover:border-amber-300/60 dark:hover:border-amber-500/20",
    linkColor:
      "text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300",
    avatarRing: "ring-2 ring-white/30",
    onlineDot: "bg-amber-400",
    welcomeGlow:
      "from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30",
    accentColor: "#d97706",
    meshGradient:
      "bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,191,36,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,191,36,0.04),transparent)]",
    typingDot: "bg-amber-400 dark:bg-amber-500",
    suggestionAccent: "text-amber-500 dark:text-amber-400",
    scrollThumb: "bg-amber-200 dark:bg-amber-800/50",
  },
  bureaucracy: {
    chatbotType: "dalilah" as const,
    headerGradient:
      "from-teal-600 via-cyan-600 to-teal-700 dark:from-teal-700 dark:via-cyan-700 dark:to-teal-800",
    userBubble: "from-teal-500 to-cyan-600",
    sendButton:
      "from-teal-500 to-cyan-600 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/35",
    inputRing:
      "focus:border-teal-400/70 focus:ring-2 focus:ring-teal-500/15 dark:focus:border-teal-500/50 dark:focus:ring-teal-500/10",
    suggestionHover:
      "hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:text-teal-700 dark:hover:text-teal-300 hover:border-teal-300/60 dark:hover:border-teal-500/20",
    linkColor:
      "text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300",
    avatarRing: "ring-2 ring-white/30",
    onlineDot: "bg-teal-400",
    welcomeGlow:
      "from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30",
    accentColor: "#0d9488",
    meshGradient:
      "bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(20,184,166,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(20,184,166,0.04),transparent)]",
    typingDot: "bg-teal-400 dark:bg-teal-500",
    suggestionAccent: "text-teal-500 dark:text-teal-400",
    scrollThumb: "bg-teal-200 dark:bg-teal-800/50",
  },
  academic: {
    chatbotType: "ilham" as const,
    headerGradient:
      "from-violet-600 via-violet-700 to-purple-700 dark:from-violet-700 dark:via-violet-800 dark:to-purple-800",
    userBubble: "from-violet-600 to-purple-700",
    sendButton:
      "from-violet-600 to-purple-700 shadow-lg shadow-violet-600/25 hover:shadow-xl hover:shadow-violet-600/35",
    inputRing:
      "focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/15 dark:focus:border-violet-500/50 dark:focus:ring-violet-500/10",
    suggestionHover:
      "hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-300 hover:border-violet-300/60 dark:hover:border-violet-500/20",
    linkColor:
      "text-violet-700 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300",
    avatarRing: "ring-2 ring-white/30",
    onlineDot: "bg-violet-400",
    welcomeGlow:
      "from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30",
    accentColor: "#7c3aed",
    meshGradient:
      "bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(167,139,250,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(167,139,250,0.04),transparent)]",
    typingDot: "bg-violet-400 dark:bg-violet-500",
    suggestionAccent: "text-violet-500 dark:text-violet-400",
    scrollThumb: "bg-violet-200 dark:bg-violet-800/50",
  },
} satisfies Record<string, DedicatedChatTheme>;
