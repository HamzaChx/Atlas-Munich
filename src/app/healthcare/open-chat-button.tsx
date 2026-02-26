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
        className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors cursor-pointer"
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={openChat}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-rose-600 text-white font-semibold shadow-lg hover:bg-rose-700 transition-all cursor-pointer"
    >
      <Sparkles className="h-5 w-5" />
      {label}
      <ArrowRight className="h-5 w-5" />
    </button>
  );
}
