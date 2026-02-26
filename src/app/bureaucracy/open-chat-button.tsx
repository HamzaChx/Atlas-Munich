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
        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={openChat}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-700 transition-all cursor-pointer"
    >
      <Sparkles className="h-5 w-5" />
      {label}
      <ArrowRight className="h-5 w-5" />
    </button>
  );
}
