"use client";

// ============================================
// Atlas Munich – community join options
//
// WhatsApp and the QR code as two equal ways in, rather than a button with a
// QR code bolted on the side. The QR box opens an expanded code over a
// blurred backdrop instead of displaying a thumbnail no phone can focus on.
// ============================================

import Image from "next/image";
import { useTranslations } from "next-intl";
import { MessageCircle, QrCode } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface JoinOptionsProps {
  whatsappUrl: string;
}

export function JoinOptions({ whatsappUrl }: JoinOptionsProps) {
  const c = useTranslations("community");
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(whatsappUrl)}&bgcolor=ffffff&color=000000&margin=16`;

  return (
    <div className="mt-6 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3.5 rounded-2xl bg-card/70 p-4 ring-1 ring-zinc-900/[0.06] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgb(0_0_0/0.08)] dark:bg-zinc-950/20 dark:ring-white/[0.06]"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tint-blue">
          <MessageCircle className="h-5 w-5 text-acc-blue" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {c("whatsappOption")}
          </span>
          <span className="block text-xs text-zinc-500 dark:text-zinc-400">
            {c("whatsappOptionSub")}
          </span>
        </span>
      </a>

      <div className="flex items-center gap-2 text-xs font-bold tracking-[0.1em] text-zinc-400 uppercase sm:flex-col sm:gap-2.5 dark:text-zinc-500">
        <span className="h-px flex-1 bg-border sm:h-full sm:w-px sm:flex-1" />
        {c("or")}
        <span className="h-px flex-1 bg-border sm:h-full sm:w-px sm:flex-1" />
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="group flex items-center gap-3.5 rounded-2xl bg-card/70 p-4 text-left ring-1 ring-zinc-900/[0.06] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgb(0_0_0/0.08)] dark:bg-zinc-950/20 dark:ring-white/[0.06]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <QrCode className="h-5 w-5 text-zinc-900" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {c("qrOption")}
              </span>
              <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                {c("qrOptionSub")}
              </span>
            </span>
          </button>
        </DialogTrigger>
        <DialogContent closeLabel={c("closeQr")}>
          <DialogTitle>{c("qrModalTitle")}</DialogTitle>
          <DialogDescription className="mt-1">{c("qrInstructions")}</DialogDescription>
          <div className="mx-auto mt-5 w-fit rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgb(0_0_0/0.12)]">
            <Image
              src={qrSrc}
              alt="WhatsApp Community QR Code"
              width={400}
              height={400}
              className="h-56 w-56 rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
