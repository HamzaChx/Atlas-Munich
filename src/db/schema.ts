import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const placeCategories = [
  "restaurant",
  "grocery",
  "mosque",
  "butcher",
  "cafe",
  "bakery",
  "study-spot",
  "sport",
  "leisure",
  "park",
] as const;

export const placeCategoryEnum = pgEnum("place_category", placeCategories);

export const jobEmploymentTypes = [
  "werkstudent",
  "internship",
  "part_time",
  "full_time",
  "graduate_program",
  "other",
] as const;

export const jobEmploymentTypeEnum = pgEnum("job_employment_type", jobEmploymentTypes);

export const jobWorkplaces = ["on_site", "hybrid", "remote"] as const;

export const jobWorkplaceEnum = pgEnum("job_workplace", jobWorkplaces);

export const jobStatuses = ["draft", "published", "archived"] as const;

export const jobStatusEnum = pgEnum("job_status", jobStatuses);

/**
 * The canonical record for a map place. The existing static list remains the
 * fallback while places are migrated, then this table becomes its source.
 */
export const places = pgTable(
  "places",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    name: varchar("name", { length: 240 }).notNull(),
    category: placeCategoryEnum("category").notNull(),
    address: text("address").notNull(),
    district: varchar("district", { length: 120 }),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    priceLevel: varchar("price_level", { length: 3 }),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    description: text("description"),
    phone: varchar("phone", { length: 48 }),
    website: text("website"),
    openingHours: text("opening_hours"),
    isVerified: boolean("is_verified").default(false).notNull(),
    rating: doublePrecision("rating"),
    reviewCount: integer("review_count"),
    isFeatured: boolean("is_featured").default(false).notNull(),
    instagram: text("instagram"),
    googlePlaceId: varchar("google_place_id", { length: 255 }),
    lastEnrichedAt: timestamp("last_enriched_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("places_slug_unique").on(table.slug),
    uniqueIndex("places_google_place_id_unique").on(table.googlePlaceId),
    index("places_category_index").on(table.category),
  ]
);

/**
 * A device-scoped profile deliberately contains no account identity. It is
 * used for onboarding preferences and can later target opt-in notifications.
 */
export const deviceProfiles = pgTable("device_profiles", {
  deviceId: varchar("device_id", { length: 128 }).primaryKey(),
  locale: varchar("locale", { length: 10 }),
  preferences: jsonb("preferences").$type<Record<string, unknown>>().default({}).notNull(),
  onboardingCompletedAt: timestamp("onboarding_completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Web Push endpoints are stored separately from profile preferences so they
 * can be revoked and expired independently.
 */
export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    deviceId: varchar("device_id", { length: 128 })
      .notNull()
      .references(() => deviceProfiles.deviceId, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("push_subscriptions_endpoint_unique").on(table.endpoint),
    index("push_subscriptions_device_id_index").on(table.deviceId),
  ]
);

/**
 * Jobs are curated in the database by an administrator. There is intentionally
 * no public write endpoint or client-side mutation path for this table.
 */
export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull(),
    title: varchar("title", { length: 240 }).notNull(),
    company: varchar("company", { length: 240 }).notNull(),
    location: varchar("location", { length: 240 }).notNull(),
    employmentType: jobEmploymentTypeEnum("employment_type").notNull(),
    workplace: jobWorkplaceEnum("workplace").notNull(),
    description: text("description").notNull(),
    applyUrl: text("apply_url").notNull(),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    status: jobStatusEnum("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("jobs_slug_unique").on(table.slug),
    index("jobs_public_listing_index").on(table.status, table.publishedAt, table.expiresAt),
  ]
);

export type Job = typeof jobs.$inferSelect;
export type JobEmploymentType = (typeof jobEmploymentTypes)[number];
export type JobWorkplace = (typeof jobWorkplaces)[number];
