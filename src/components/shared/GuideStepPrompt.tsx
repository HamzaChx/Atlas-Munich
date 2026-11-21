// ============================================
// Atlas Munich – "Stuck on this step? Ask Dalilah"
//
// One quiet line after each top-level guide section. It opens the owning
// persona's dedicated chat with a question built from the step, through the
// chat's existing ?q= seed (DedicatedChat sends it once, then drops it from
// the URL). Deliberately a sentence with a link, not a box: the reader is
// mid-article and should not be pulled out unless they are actually stuck.
// ============================================

import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { GuidePersona } from "@/lib/guide-personas";

interface GuideStepPromptProps {
  persona: GuidePersona;
  question: string;
  stuckLabel: string;
  askLabel: string;
  className?: string;
}

export function GuideStepPrompt({
  persona,
  question,
  stuckLabel,
  askLabel,
  className,
}: GuideStepPromptProps) {
  return (
    <p
      className={cn(
        "dossier-screen-only flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.9375rem]",
        className
      )}
    >
      <Image
        src={persona.avatar}
        alt=""
        width={28}
        height={28}
        className={cn("h-7 w-7 rounded-full object-cover ring-2", persona.ring)}
      />
      <span className="text-zinc-600 dark:text-zinc-400">{stuckLabel}</span>
      <Link
        href={`${persona.chatPath}?q=${encodeURIComponent(question)}`}
        className={cn(
          "group inline-flex min-h-11 items-center gap-1 font-semibold underline decoration-current/0 underline-offset-4 transition-colors hover:decoration-current/60",
          persona.acc
        )}
      >
        {askLabel}
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </Link>
    </p>
  );
}
