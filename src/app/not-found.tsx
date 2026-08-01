import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared";
import { getFeaturedGuides } from "@/data/guides";
import { localizeGuides } from "@/data/guides-i18n";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations("errors");
  const guides = await localizeGuides(getFeaturedGuides().slice(0, 3), locale);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-tint-terra">
        <Compass className="h-8 w-8 text-acc-terra" />
      </div>
      <span className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        {t("notFoundEyebrow")}
      </span>
      <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
        {t("notFoundTitle")}
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
        {t("notFoundDescription")}
      </p>

      <SearchBar
        className="mt-8 w-full max-w-md"
        placeholder={t("notFoundSearchPlaceholder")}
        autoFocus
      />

      <Button asChild size="lg" className="mt-6">
        <Link href="/">{t("backHome")}</Link>
      </Button>

      {guides.length > 0 && (
        <div className="mt-14 w-full border-t border-zinc-200 pt-10 dark:border-zinc-800">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            {t("notFoundPopularGuides")}
          </h2>
          <ul className="flex flex-col gap-3 text-left">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-zinc-200 px-4 py-3 transition-colors duration-200 hover:border-zellige/40 hover:bg-tint-green/40 dark:border-zinc-800 dark:hover:border-zellige/40 dark:hover:bg-tint-green/10"
                >
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {guide.title}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-zellige" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
