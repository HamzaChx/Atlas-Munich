"use client";

// ============================================
// Atlas Munich Chatbot - Client Wrapper
// This wrapper is needed because the main layout is a server component
// ============================================

import dynamic from "next/dynamic";

// Dynamically import the Chatbot to avoid SSR issues
const Chatbot = dynamic(() => import("./Chatbot").then((mod) => mod.Chatbot), {
  ssr: false,
  loading: () => null, // No loading state, chatbot appears when ready
});

export function ChatbotWrapper() {
  return <Chatbot />;
}

export default ChatbotWrapper;
