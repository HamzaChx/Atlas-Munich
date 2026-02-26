import { type Metadata } from "next";
import { DedicatedChat, CHAT_THEMES } from "@/components/chatbot/DedicatedChat";

export const metadata: Metadata = {
  title: "Chat with Riad – Housing Application Assistant",
  description:
    "Paste any WG or apartment listing and Riad will write you a ready-to-send, personalised application in flawless German.",
};

export default function HousingChatPage() {
  return <DedicatedChat theme={CHAT_THEMES.housing} backPath="/housing" />;
}
