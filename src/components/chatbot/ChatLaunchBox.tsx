"use client";

// ============================================
// Atlas Munich – the launch box
//
// A composer that lives outside the chat. Type or paste here and you land in
// the assistant's chat with the answer already streaming, so the most
// impressive thing this site does costs zero clicks to reach.
//
// The text travels through the read-once pending slot rather than a query
// string: a pasted WG listing is routinely longer than a URL can carry.
// ============================================

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { ArrowUp } from "lucide-react";

import type { ChatbotType } from "@/chatbot/types";
import { cn } from "@/lib/utils";
import { ASSISTANT_ACCENTS } from "./chat-themes";
import { setPendingMessage } from "./chat-seed";

interface ChatLaunchBoxProps {
  chatbot: ChatbotType;
  /** Where the conversation continues, e.g. "/housing/chat" */
  chatPath: string;
  placeholder: string;
  /** Accessible name for the send button */
  submitLabel: string;
  /** `lg` is the homepage hero; `default` sits inside an assistant panel */
  size?: "default" | "lg";
  className?: string;
}

export function ChatLaunchBox({
  chatbot,
  chatPath,
  placeholder,
  submitLabel,
  size = "default",
  className,
}: ChatLaunchBoxProps) {
  const router = useRouter();
  const accent = ASSISTANT_ACCENTS[chatbot];

  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = value.trim().length > 0;

  /* Grow with the content instead of scrolling: a pasted listing should be
     visibly received, not hidden behind a one-line window. */
  const resize = (next: string) => {
    setValue(next);
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    track("chat_launch", { chatbot, length: trimmed.length });
    setPendingMessage(chatbot, trimmed);
    router.push(chatPath);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-end gap-2 rounded-3xl border border-border bg-card p-2 shadow-[0_6px_24px_rgb(0_0_0/0.08)] transition-shadow duration-200 focus-within:shadow-[0_10px_32px_rgb(0_0_0/0.12)] dark:shadow-none dark:focus-within:shadow-none",
          size === "lg" ? "pl-5" : "pl-4"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => resize(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          aria-label={placeholder}
          style={{ maxHeight: "12rem" }}
          className={cn(
            "w-full flex-1 resize-none self-center overflow-y-auto bg-transparent py-2.5 text-zinc-900 outline-none scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden placeholder:text-zinc-400 dark:text-zinc-50 dark:placeholder:text-zinc-500",
            size === "lg" ? "text-base sm:text-[17px]" : "text-[15px]"
          )}
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label={submitLabel}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full transition-all duration-200",
            size === "lg" ? "h-11 w-11" : "h-10 w-10",
            canSend
              ? cn("cursor-pointer text-card hover:scale-105 active:scale-95", accent.accBg)
              : "cursor-not-allowed bg-muted text-zinc-400 dark:text-zinc-500"
          )}
        >
          <ArrowUp className={size === "lg" ? "h-5 w-5" : "h-[18px] w-[18px]"} />
        </button>
      </div>
    </form>
  );
}

export default ChatLaunchBox;
