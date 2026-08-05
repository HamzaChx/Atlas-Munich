import "server-only";

import { and, desc, eq, gt, isNull, lte, or } from "drizzle-orm";

import { getDatabase } from "@/db";
import { jobs } from "@/db/schema";

const MAX_PUBLIC_JOBS = 100;

/**
 * The only job query exposed to the web app. Drafts, archived jobs, scheduled
 * jobs, and expired jobs never reach visitors.
 */
export async function getPublishedJobs(limit = 50) {
  const database = getDatabase();
  if (!database) return [];

  const now = new Date();
  const safeLimit = Math.min(Math.max(limit, 1), MAX_PUBLIC_JOBS);

  return database
    .select()
    .from(jobs)
    .where(
      and(
        eq(jobs.status, "published"),
        lte(jobs.publishedAt, now),
        or(isNull(jobs.expiresAt), gt(jobs.expiresAt, now))
      )
    )
    .orderBy(desc(jobs.publishedAt), desc(jobs.createdAt))
    .limit(safeLimit);
}

export type PublishedJob = Awaited<ReturnType<typeof getPublishedJobs>>[number];
