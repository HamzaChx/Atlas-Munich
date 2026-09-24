export const fmtMonth = (d: string | Date, locale = "en") =>
  new Date(d).toLocaleDateString(locale, { month: "short" });

export const fmtDay = (d: string | Date) => new Date(d).getDate();

export const fmtUpdated = (d: string | Date, locale = "en") =>
  new Date(d).toLocaleDateString(locale, { month: "short", year: "numeric" });

export const isUpcoming = (iso: string) =>
  new Date(iso) >= new Date(Date.now() - 24 * 60 * 60 * 1000);

/** A guide unchecked for longer than this carries a visible warning. */
export const STALE_AFTER_MONTHS = 6;

/** Whole months from `from` to `to`, never negative. */
export function monthsBetween(from: string | Date, to: Date = new Date()): number {
  const start = new Date(from);
  let months = (to.getFullYear() - start.getFullYear()) * 12 + (to.getMonth() - start.getMonth());
  if (to.getDate() < start.getDate()) months -= 1;
  return Math.max(0, months);
}

/** True once more than STALE_AFTER_MONTHS have passed since `verifiedAt`. */
export function isStale(verifiedAt: string | Date, now: Date = new Date()): boolean {
  const limit = new Date(verifiedAt);
  limit.setMonth(limit.getMonth() + STALE_AFTER_MONTHS);
  return now > limit;
}

export interface Freshness {
  stale: boolean;
  months: number;
}

/* Plain function, not in the client component, so server code can call it. */
export function freshnessAt(verifiedAt: string, now: Date = new Date()): Freshness {
  return { stale: isStale(verifiedAt, now), months: monthsBetween(verifiedAt, now) };
}

/* Pinned to UTC: an ISO date parses as UTC midnight, so a reader west of
   Greenwich would otherwise see the previous day, and the prerendered HTML
   and the hydrated client would disagree. */
export const fmtLongDate = (d: string | Date, locale = "en") =>
  new Date(d).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
