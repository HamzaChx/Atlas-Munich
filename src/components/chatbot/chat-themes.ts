// ============================================
// Atlas Munich – assistant accents
//
// Every assistant wears one brand hue, the same pairing the /tools cards use.
// `accBg` is always paired with `text-card`: the --acc-* ramp is dark in the
// light theme and light in the dark theme, and --card mirrors it, so a solid
// accent fill keeps its contrast in both themes without a second class.
// ============================================

import type { ChatbotType } from "@/chatbot/types";

export interface AssistantAccent {
  /** Soft surface wearing the assistant's hue */
  tint: string;
  /** Text / marker colour that reads on the tint */
  acc: string;
  /** Solid accent fill, pair with `text-card` */
  accBg: string;
  /** Accent colour applied on a parent `group` hover */
  accHover: string;
  /** Ring around avatars */
  ring: string;
  /** Composer focus treatment */
  focus: string;
}

const TERRA: AssistantAccent = {
  tint: "bg-tint-terra",
  acc: "text-acc-terra",
  accBg: "bg-acc-terra",
  accHover: "group-hover:text-acc-terra",
  ring: "ring-acc-terra/40",
  focus: "focus:border-acc-terra/60 focus:ring-2 focus:ring-acc-terra/20",
};

const BLUE: AssistantAccent = {
  tint: "bg-tint-blue",
  acc: "text-acc-blue",
  accBg: "bg-acc-blue",
  accHover: "group-hover:text-acc-blue",
  ring: "ring-acc-blue/40",
  focus: "focus:border-acc-blue/60 focus:ring-2 focus:ring-acc-blue/20",
};

const GREEN: AssistantAccent = {
  tint: "bg-tint-green",
  acc: "text-acc-green",
  accBg: "bg-acc-green",
  accHover: "group-hover:text-acc-green",
  ring: "ring-acc-green/40",
  focus: "focus:border-acc-green/60 focus:ring-2 focus:ring-acc-green/20",
};

const SAFFRON: AssistantAccent = {
  tint: "bg-tint-saffron",
  acc: "text-acc-saffron",
  accBg: "bg-acc-saffron",
  accHover: "group-hover:text-acc-saffron",
  ring: "ring-acc-saffron/40",
  focus: "focus:border-acc-saffron/60 focus:ring-2 focus:ring-acc-saffron/20",
};

const TEAL: AssistantAccent = {
  tint: "bg-tint-teal",
  acc: "text-acc-teal",
  accBg: "bg-acc-teal",
  accHover: "group-hover:text-acc-teal",
  ring: "ring-acc-teal/40",
  focus: "focus:border-acc-teal/60 focus:ring-2 focus:ring-acc-teal/20",
};

/* One hue per assistant, chosen by what the portrait looks like first and
   what the role means second:
     Ilham   green   her book's cover is green with gold tooling; the cover
                     is claimed first, everything else works around it.
     Riad    terra   a house of terracotta clay.
     Dalilah blue    civic and official, and her folder is tiled in blue
                     zellige under a Bavarian blue-white ribbon.
     Loubna  teal    her medical bag's own zellige trim, and the clinical
                     teal used for health the world over now that green
                     is spoken for. */
export const ASSISTANT_ACCENTS: Record<ChatbotType, AssistantAccent> = {
  zellija: BLUE,
  hamid: GREEN,
  jmila: SAFFRON,
  hamza: TERRA,
  riad: TERRA,
  dalilah: BLUE,
  ilham: GREEN,
  loubna: TEAL,
};

export interface DedicatedChatTheme extends AssistantAccent {
  chatbotType: ChatbotType;
}

/** Keyed by the tool section that owns the chat route. */
export const CHAT_THEMES = {
  zellija: { chatbotType: "zellija", ...BLUE },
  housing: { chatbotType: "riad", ...TERRA },
  bureaucracy: { chatbotType: "dalilah", ...BLUE },
  academic: { chatbotType: "ilham", ...GREEN },
  healthcare: { chatbotType: "loubna", ...TEAL },
} satisfies Record<string, DedicatedChatTheme>;
