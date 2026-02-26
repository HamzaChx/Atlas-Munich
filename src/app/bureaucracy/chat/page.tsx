import { type Metadata } from "next";
import { DedicatedChat } from "@/components/chatbot/DedicatedChat";
import { CHAT_THEMES } from "@/components/chatbot/chat-themes";

export const metadata: Metadata = {
  title: "Chat with Dalilah – German Bureaucracy Navigator",
  description:
    "Ask Dalilah about Anmeldung, residence permits, KVR appointments, and every piece of German paperwork you need to tackle in Munich.",
};

export default function BureaucracyChatPage() {
  return <DedicatedChat theme={CHAT_THEMES.bureaucracy} backPath="/bureaucracy" />;
}
