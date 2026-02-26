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
        href="/healthcare/chat"
        className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <Link
      href="/healthcare/chat"
      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-rose-600 text-white font-semibold shadow-lg hover:bg-rose-700 transition-all"
    >
      <Sparkles className="h-5 w-5" />
      {label}
      <ArrowRight className="h-5 w-5" />
    </Link>
  );
}
