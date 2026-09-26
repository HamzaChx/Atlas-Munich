import { type Metadata } from "next";
import { DedicatedChat } from "@/components/chatbot/DedicatedChat";
import { AskLanding, type LandingSpecialist } from "@/components/chatbot/AskLanding";
import { CHAT_THEMES } from "@/components/chatbot/chat-themes";
import { assistants, isLive } from "@/data/assistants";

export const metadata: Metadata = {
  title: "Chno darrek? Ask Zellija · Atlas Munich",
  description:
    "Tell Zellija what's bothering you in Munich: rent, paperwork, health or your thesis. The right specialist takes it from there.",
};

// Every live specialist gets a pain card on Zellija's landing, read from the
// one roster so a new helper shows up here without a second copy.
const specialists: LandingSpecialist[] = assistants.filter(isLive).map((assistant) => ({
  chatbot: assistant.chatbot!,
  name: assistant.name,
  chatPath: assistant.chatPath!,
  character: assistant.character!,
  lineArt: assistant.lineArt,
}));

export default function ChatPage() {
  return (
    <DedicatedChat
      theme={CHAT_THEMES.zellija}
      backPath="/"
      landing={<AskLanding specialists={specialists} />}
    />
  );
}
