CREATE TYPE "public"."job_employment_type" AS ENUM('werkstudent', 'internship', 'part_time', 'full_time', 'graduate_program', 'other');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."job_workplace" AS ENUM('on_site', 'hybrid', 'remote');--> statement-breakpoint
CREATE TYPE "public"."place_category" AS ENUM('restaurant', 'grocery', 'mosque', 'butcher', 'cafe', 'bakery', 'study-spot', 'sport', 'leisure', 'park');--> statement-breakpoint
CREATE TABLE "device_profiles" (
	"device_id" varchar(128) PRIMARY KEY NOT NULL,
	"locale" varchar(10),
	"preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"onboarding_completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title" varchar(240) NOT NULL,
	"company" varchar(240) NOT NULL,
	"location" varchar(240) NOT NULL,
	"employment_type" "job_employment_type" NOT NULL,
	"workplace" "job_workplace" NOT NULL,
	"description" text NOT NULL,
	"apply_url" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "job_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"name" varchar(240) NOT NULL,
	"category" "place_category" NOT NULL,
	"address" text NOT NULL,
	"district" varchar(120),
	"latitude" double precision,
	"longitude" double precision,
	"price_level" varchar(3),
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"description" text,
	"phone" varchar(48),
	"website" text,
	"opening_hours" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"rating" double precision,
	"review_count" integer,
	"is_featured" boolean DEFAULT false NOT NULL,
	"instagram" text,
	"google_place_id" varchar(255),
	"last_enriched_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"device_id" varchar(128) NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_device_id_device_profiles_device_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."device_profiles"("device_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "jobs_slug_unique" ON "jobs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "jobs_public_listing_index" ON "jobs" USING btree ("status","published_at","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "places_slug_unique" ON "places" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "places_google_place_id_unique" ON "places" USING btree ("google_place_id");--> statement-breakpoint
CREATE INDEX "places_category_index" ON "places" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "push_subscriptions_endpoint_unique" ON "push_subscriptions" USING btree ("endpoint");--> statement-breakpoint
CREATE INDEX "push_subscriptions_device_id_index" ON "push_subscriptions" USING btree ("device_id");