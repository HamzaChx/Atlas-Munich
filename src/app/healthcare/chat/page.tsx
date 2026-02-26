import { type Metadata } from "next";
import { DedicatedChat, CHAT_THEMES } from "@/components/chatbot/DedicatedChat";

export const metadata: Metadata = {
  title: "Chat with Loubna – Healthcare Navigator",
  description:
    "Ask Loubna about health insurance, finding a doctor, understanding medical processes, and navigating the German healthcare system in Munich.",
};

export default function HealthcareChatPage() {
  return <DedicatedChat theme={CHAT_THEMES.healthcare} backPath="/healthcare" />;
}
