import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const RUNTIME_DATABASE_ROLE = "atlas_app";

function assertRuntimeDatabaseRole(databaseUrl: string) {
  let role: string;

  try {
    role = decodeURIComponent(new URL(databaseUrl).username);
  } catch {
    throw new Error("DATABASE_URL must be a valid Postgres connection string.");
  }

  if (role !== RUNTIME_DATABASE_ROLE) {
    throw new Error(
      `DATABASE_URL must use the ${RUNTIME_DATABASE_ROLE} role. Use DIRECT_DATABASE_URL only for migrations and administration.`
    );
  }
}

/**
 * Returns a database client only when Neon has been configured. Keeping this
 * lazy lets the existing static experience run during the migration rollout.
 */
export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) return null;

  assertRuntimeDatabaseRole(databaseUrl);

  return drizzle(neon(databaseUrl), { schema });
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}
