import { type Metadata } from "next";
import { DedicatedChat, type QuickAction } from "@/components/chatbot/DedicatedChat";
import { CHAT_THEMES, ASSISTANT_ACCENTS } from "@/components/chatbot/chat-themes";
import { CHATBOT_CONFIG } from "@/chatbot/types";
import { assistants, isLive } from "@/data/assistants";

export const metadata: Metadata = {
  title: "Ask Zellija – Atlas Munich Guide",
  description:
    "Ask about housing, bureaucracy, university life, or places in Munich — or jump straight to a specialist.",
};

// Live specialists become quick-action chips on Zellija's welcome screen, so
// a reader who already knows who they need can skip straight there — the
// same roster /tools used to show, read from the one place it's defined
// instead of a second copy.
const quickActions: QuickAction[] = assistants.filter(isLive).map((assistant) => ({
  name: assistant.name,
  avatar: assistant.avatar!,
  href: assistant.chatPath!,
  accent: ASSISTANT_ACCENTS[assistant.chatbot!],
  tagline: CHATBOT_CONFIG[assistant.chatbot!].tagline,
}));

export default function ChatPage() {
  return (
    <>
      <link rel="preload" href="/zellija.jpeg" as="image" />
      <DedicatedChat theme={CHAT_THEMES.zellija} backPath="/" quickActions={quickActions} />
    </>
  );
}
