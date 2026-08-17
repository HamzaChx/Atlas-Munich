import { type Metadata } from "next";
import { DedicatedChat } from "@/components/chatbot/DedicatedChat";
import { CHAT_THEMES } from "@/components/chatbot/chat-themes";

export const metadata: Metadata = {
  title: "Chat with Ilham – Academic Research Companion",
  description:
    "Ask Ilham to help you research, structure, and refine academic work at TUM or LMU – from thesis outlines to citations.",
};

export default function AcademicChatPage() {
  return (
    <>
      <link rel="preload" href="/ilham.webp" as="image" type="image/webp" />
      <DedicatedChat theme={CHAT_THEMES.academic} backPath="/chat" />
    </>
  );
}
