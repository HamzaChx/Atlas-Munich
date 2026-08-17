import { type Metadata } from "next";
import { DedicatedChat } from "@/components/chatbot/DedicatedChat";
import { CHAT_THEMES } from "@/components/chatbot/chat-themes";

export const metadata: Metadata = {
  title: "Chat with Riad – Housing Application Assistant",
  description:
    "Paste any WG or apartment listing and Riad will write you a ready-to-send, personalised application in flawless German.",
};

export default function HousingChatPage() {
  return (
    <>
      {/* Preload the avatar so there's zero delay when the chat UI mounts */}
      <link rel="preload" href="/riad.webp" as="image" type="image/webp" />
      <DedicatedChat theme={CHAT_THEMES.housing} backPath="/chat" />
    </>
  );
}
