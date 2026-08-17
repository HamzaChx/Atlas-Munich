"use client";

// ============================================
// Atlas Munich – chat response blocks
//
// A chat turn is a list of typed blocks (see ChatBlock in @/chatbot/types),
// not a string. Each renders as a real component here instead of being
// scraped back out of prose the way the old [ROUTE:...] marker was.
// ============================================

import { useState } from "react";
import Image from "next/image";
import { Check, X, BookOpen, MapPin, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ChatMarkdown } from "./markdown";
import { BottomSheet, BottomSheetContent } from "@/components/ui/bottom-sheet";
import { PlacesMap } from "@/components/shared/PlacesMap";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { CHATBOT_CONFIG, type ChatBlock } from "@/chatbot/types";
import type { AssistantAccent } from "./chat-themes";

function GuideCitationBlock({
  block,
  accent,
}: {
  block: Extract<ChatBlock, { type: "guide-citation" }>;
  accent: AssistantAccent;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold outline-none transition-opacity hover:opacity-80",
          accent.tint,
          accent.acc,
          accent.focus
        )}
      >
        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
        {block.title}
      </button>

      <BottomSheet open={open} onOpenChange={setOpen}>
        <BottomSheetContent title={block.title} className="sm:mx-auto sm:max-w-lg">
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {block.summary}
          </p>
          <Link
            href={`/guides/${block.slug}`}
            className={cn("mt-4 inline-flex items-center gap-1 text-sm font-semibold", accent.acc)}
          >
            Read the full guide
          </Link>
        </BottomSheetContent>
      </BottomSheet>
    </>
  );
}

function MapResultBlock({ block }: { block: Extract<ChatBlock, { type: "map-result" }> }) {
  if (block.places.length === 0) return null;
  return (
    <div className="mt-2 overflow-hidden rounded-2xl">
      <PlacesMap places={block.places} className="h-64" />
    </div>
  );
}

function WhatsAppQrBlock({ accent }: { accent: AssistantAccent }) {
  return (
    <a
      href={WHATSAPP_COMMUNITY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 outline-none transition-opacity hover:opacity-90",
        accent.tint,
        accent.focus
      )}
    >
      <Image
        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(WHATSAPP_COMMUNITY_URL)}&bgcolor=ffffff&color=000000&margin=8`}
        alt="WhatsApp community QR code"
        width={56}
        height={56}
        className="h-14 w-14 shrink-0 rounded-lg bg-white"
      />
      <span className={cn("text-sm font-semibold leading-snug", accent.acc)}>
        Ask the WhatsApp community — real people who&apos;ve been through this too.
      </span>
    </a>
  );
}

function HandoffCard({
  block,
  messageId,
  accent,
  onConfirm,
  onDeny,
}: {
  block: Extract<ChatBlock, { type: "handoff-to-specialized-agent" }>;
  messageId: string;
  accent: AssistantAccent;
  onConfirm: (messageId: string) => void;
  onDeny: (messageId: string) => void;
}) {
  const target = CHATBOT_CONFIG[block.chatbot];

  if (block.status === "declined") {
    return (
      <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
        Continuing without {target.name}.
      </p>
    );
  }

  return (
    <div className="mt-2 rounded-2xl border border-black/[0.06] bg-white/70 p-4 dark:border-border dark:bg-black/20">
      <div className="flex items-center gap-2.5">
        <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-full">
          <Image src={target.avatar} alt="" fill sizes="32px" className="object-cover" />
        </span>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Talk to {target.name}?
        </p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {block.reason}
      </p>
      {block.status === "confirmed" ? (
        <p className="mt-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
          Connecting you to {target.name}…
        </p>
      ) : (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onConfirm(messageId)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-card outline-none transition-opacity hover:opacity-90",
              accent.accBg,
              accent.focus
            )}
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Talk to {target.name}
          </button>
          <button
            type="button"
            onClick={() => onDeny(messageId)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full bg-muted px-3.5 py-1.5 text-xs font-semibold text-zinc-600 outline-none transition-colors hover:bg-secondary dark:text-zinc-300",
              accent.focus
            )}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            No thanks
          </button>
        </div>
      )}
    </div>
  );
}

function LocationRequestCard({
  block,
  accent,
  onConfirm,
  onDeny,
}: {
  block: Extract<ChatBlock, { type: "request-location" }>;
  accent: AssistantAccent;
  onConfirm: () => void;
  onDeny: () => void;
}) {
  const [awaiting, setAwaiting] = useState(false);

  if (block.status === "denied") {
    return (
      <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
        Continuing without your location.
      </p>
    );
  }

  if (block.status === "granted") {
    return (
      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-500">
        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
        Location shared.
      </p>
    );
  }

  return (
    <div className="mt-2 rounded-2xl border border-black/[0.06] bg-white/70 p-4 dark:border-border dark:bg-black/20">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            accent.tint,
            accent.acc
          )}
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Share your location?
        </p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {block.reason}
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={awaiting}
          onClick={() => {
            setAwaiting(true);
            onConfirm();
          }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-card outline-none transition-opacity hover:opacity-90 disabled:opacity-60",
            accent.accBg,
            accent.focus
          )}
        >
          {awaiting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          Share location
        </button>
        <button
          type="button"
          disabled={awaiting}
          onClick={onDeny}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full bg-muted px-3.5 py-1.5 text-xs font-semibold text-zinc-600 outline-none transition-colors hover:bg-secondary disabled:opacity-60 dark:text-zinc-300",
            accent.focus
          )}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Not now
        </button>
      </div>
    </div>
  );
}

/** Shown in place of an empty bubble while a tool call is in flight, instead
    of a bare spinner or nothing at all. */
function ChatStatusText({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 opacity-70">
      <span className="flex items-center gap-1">
        {[0, 0.15, 0.3].map((delay) => (
          <span
            key={delay}
            className="dc-typing-dot h-1.5 w-1.5 rounded-full bg-current"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </span>
      {label}
    </span>
  );
}

export function ChatBlocks({
  blocks,
  messageId,
  linkClass,
  accent,
  streaming,
  statusLabel,
  onConfirmHandoff,
  onDenyHandoff,
  onConfirmLocationRequest,
  onDenyLocationRequest,
}: {
  blocks: ChatBlock[];
  messageId: string;
  /** Text colour class for links inside text blocks, e.g. `text-acc-blue` */
  linkClass: string;
  accent: AssistantAccent;
  /** True while the message is still being written */
  streaming?: boolean;
  /** Named tool-call status to show while there's no visible block yet */
  statusLabel?: string;
  onConfirmHandoff: (messageId: string) => void;
  onDenyHandoff: (messageId: string) => void;
  onConfirmLocationRequest: (messageId: string) => void;
  onDenyLocationRequest: (messageId: string) => void;
}) {
  if (streaming && blocks.length === 0) {
    return <ChatStatusText label={statusLabel ?? "Thinking…"} />;
  }

  return (
    <div className="space-y-1">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "text":
            return (
              <ChatMarkdown key={i} text={block.text} linkClass={linkClass} streaming={streaming} />
            );
          case "guide-citation":
            return <GuideCitationBlock key={i} block={block} accent={accent} />;
          case "map-result":
            return <MapResultBlock key={i} block={block} />;
          case "display-whatsapp-qr":
            return <WhatsAppQrBlock key={i} accent={accent} />;
          case "handoff-to-specialized-agent":
            return (
              <HandoffCard
                key={i}
                block={block}
                messageId={messageId}
                accent={accent}
                onConfirm={onConfirmHandoff}
                onDeny={onDenyHandoff}
              />
            );
          case "request-location":
            return (
              <LocationRequestCard
                key={i}
                block={block}
                accent={accent}
                onConfirm={() => onConfirmLocationRequest(messageId)}
                onDeny={() => onDenyLocationRequest(messageId)}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
