import { ArrowUpRight, BriefcaseBusiness, Building2, MapPin, Monitor } from "lucide-react";
import type { TranslationValues } from "use-intl";

import type { PublishedJob } from "@/db/jobs";

interface JobsBoardProps {
  databaseConfigured: boolean;
  jobs: PublishedJob[];
  locale: string;
  translate: (key: string, values?: TranslationValues) => string;
}

const dateLocales: Record<string, string> = {
  de: "de-DE",
  en: "en-GB",
  fr: "fr-FR",
};

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(dateLocales[locale] ?? "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function JobsBoard({ databaseConfigured, jobs, locale, translate }: JobsBoardProps) {
  if (jobs.length === 0) {
    return (
      <section className="rounded-[1.75rem] bg-card p-7 text-center shadow-[0_2px_20px_rgb(0_0_0/0.06)] dark:shadow-none dark:ring-1 dark:ring-border sm:p-10">
        <BriefcaseBusiness className="mx-auto h-8 w-8 text-zellige" aria-hidden="true" />
        <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {translate(databaseConfigured ? "emptyTitle" : "setupTitle")}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {translate(databaseConfigured ? "emptyDescription" : "setupDescription")}
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <article
          key={job.id}
          className="rounded-[1.5rem] bg-card p-5 shadow-[0_2px_20px_rgb(0_0_0/0.06)] dark:shadow-none dark:ring-1 dark:ring-border sm:p-6"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-semibold text-zellige">
                <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                {job.company}
              </p>
              <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {job.title}
              </h2>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Monitor className="h-4 w-4" aria-hidden="true" />
                  {translate(`workplace.${job.workplace}`)}
                </span>
              </div>
            </div>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-zinc-50 dark:text-zinc-900"
            >
              {translate("apply")}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {job.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <span className="rounded-full bg-zellige-soft px-3 py-1 text-xs font-semibold text-zellige">
              {translate(`employment.${job.employmentType}`)}
            </span>
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
            {job.expiresAt && (
              <span className="ml-auto text-xs text-zinc-500 dark:text-zinc-400">
                {translate("closes", { date: formatDate(job.expiresAt, locale) })}
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
