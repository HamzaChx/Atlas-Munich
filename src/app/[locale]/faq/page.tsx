"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { faqHref } from "@/data/faqs";
import { hubs } from "@/data/hubs";

/**
 * The forwarding page for the retired /faq route. With a known question in the
 * hash it sends the reader straight to it; without one it offers the four hubs
 * rather than a dead end.
 */
export default function FaqRedirectPage() {
  const router = useRouter();
  const t = useTranslations("hubs");
  const tFaq = useTranslations("faq");

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id.startsWith("faq-")) return;

    const href = faqHref(id);
    // The fragment has to be reattached by hand: it never left the browser.
    router.replace(`${href.split("#")[0]}#${id}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-10 pt-24 text-center sm:pt-32">
        <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          {tFaq("title")}
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
          {tFaq("movedDescription")}
        </p>
      </section>

      <div className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {hubs.map((hub) => (
            <Link
              key={hub.key}
              href={`${hub.route}#questions`}
              className={`group flex items-center justify-between gap-3 rounded-2xl px-5 py-4 text-sm font-semibold text-zinc-900 outline-none transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-zellige dark:text-zinc-50 ${hub.tint}`}
            >
              {t(`${hub.key}.title`)} {t(`${hub.key}.titleHighlight`)}
              <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400/70 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
