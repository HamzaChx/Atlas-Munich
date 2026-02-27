import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface OpenChatButtonProps {
  label: string;
  variant?: "primary" | "link";
}

export function OpenChatButton({ label, variant = "primary" }: OpenChatButtonProps) {
  if (variant === "link") {
    return (
      <Link
        href="/academic/chat"
        className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors"
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <Link
      href="/academic/chat"
      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-violet-700 text-white font-semibold shadow-lg hover:bg-violet-800 transition-all"
    >
      <Sparkles className="h-5 w-5" />
      {label}
      <ArrowRight className="h-5 w-5" />
    </Link>
  );
}
