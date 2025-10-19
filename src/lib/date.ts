export const fmtMonth = (d: string | Date, locale = "en") =>
  new Date(d).toLocaleDateString(locale, { month: "short" });

export const fmtDay = (d: string | Date) => new Date(d).getDate();

export const fmtUpdated = (d: string | Date, locale = "en") =>
  new Date(d).toLocaleDateString(locale, { month: "short", year: "numeric" });

export const isUpcoming = (iso: string) =>
  new Date(iso) >= new Date(Date.now() - 24 * 60 * 60 * 1000);
