// ============================================
// Which persona owns a guide
//
// A guide is handed over by the assistant who owns its topic: the dossier card
// wears that persona's tint and every "Stuck on this step?" prompt opens their
// chat. Career sits with Dalilah because the rules that decide whether a
// student may work (the 140-day limit) are residence law. Useful apps have no
// owner, so those guides carry no prompts.
// ============================================

import type { CategoryKey } from "@/types";
import type { ChatbotType } from "@/chatbot/types";
import { assistants } from "@/data/assistants";
import { ASSISTANT_ACCENTS, type AssistantAccent } from "@/components/chatbot/chat-themes";

export interface GuidePersona extends AssistantAccent {
  name: string;
  avatar: string;
  chatPath: string;
}

const OWNER: Partial<Record<CategoryKey, ChatbotType>> = {
  "rent-housing": "riad",
  "kvr-residence": "dalilah",
  "university-life": "ilham",
  career: "dalilah",
};

export function personaForCategory(categoryKey: CategoryKey): GuidePersona | null {
  const chatbot = OWNER[categoryKey];
  if (!chatbot) return null;
  const assistant = assistants.find((a) => a.chatbot === chatbot);
  if (!assistant?.avatar || !assistant.chatPath) return null;
  return {
    ...ASSISTANT_ACCENTS[chatbot],
    name: assistant.name,
    avatar: assistant.avatar,
    chatPath: assistant.chatPath,
  };
}
