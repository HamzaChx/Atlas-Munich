"use client";

import { Sparkles, ArrowRight } from "lucide-react";

interface OpenChatButtonProps {
  label: string;
  variant?: "primary" | "link";
}

export function OpenChatButton({ label, variant = "primary" }: OpenChatButtonProps) {
  const openChat = () => {
    window.dispatchEvent(new CustomEvent("open-chatbot"));
  };

  if (variant === "link") {
    return (
      <button
        onClick={openChat}
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={openChat}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all cursor-pointer"
    >
      <Sparkles className="h-5 w-5" />
      {label}
      <ArrowRight className="h-5 w-5" />
    </button>
  );
}
