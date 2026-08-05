-- Custom SQL migration file, put your code below! --
-- The role is created through SQL (not the Neon Console) so it is not made a
-- member of neon_superuser, whose members bypass Postgres RLS.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_auth_members membership
    JOIN pg_roles parent_role ON parent_role.oid = membership.roleid
    JOIN pg_roles member_role ON member_role.oid = membership.member
    WHERE parent_role.rolname = 'neon_superuser'
      AND member_role.rolname = 'atlas_app'
  ) THEN
    RAISE EXCEPTION
      'atlas_app is a member of neon_superuser and can bypass RLS. Drop it and rerun this migration.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'atlas_app') THEN
    CREATE ROLE atlas_app
      LOGIN
      NOINHERIT
      NOCREATEDB
      NOCREATEROLE
      NOREPLICATION
      NOBYPASSRLS
      PASSWORD NULL;
  ELSE
    ALTER ROLE atlas_app
      NOINHERIT
      NOCREATEDB
      NOCREATEROLE
      NOREPLICATION
      NOBYPASSRLS;
  END IF;
END
$$;
--> statement-breakpoint

-- Database and schema access are explicit, never inherited from PUBLIC.
DO $$
BEGIN
  EXECUTE format('REVOKE CONNECT ON DATABASE %I FROM PUBLIC', current_database());
  EXECUTE format('GRANT CONNECT ON DATABASE %I TO atlas_app', current_database());
END
$$;
--> statement-breakpoint
REVOKE ALL ON SCHEMA public FROM PUBLIC;
--> statement-breakpoint
GRANT USAGE ON SCHEMA public TO atlas_app;
--> statement-breakpoint
REVOKE ALL ON TABLE device_profiles, jobs, places, push_subscriptions FROM PUBLIC;
--> statement-breakpoint
REVOKE ALL ON TABLE device_profiles, jobs, places, push_subscriptions FROM atlas_app;
--> statement-breakpoint
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM PUBLIC;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM PUBLIC;
--> statement-breakpoint

-- Enabling and forcing RLS gives every table a default-deny posture. Tables
-- without policies stay inaccessible, even if a privilege is granted later.
ALTER TABLE device_profiles ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE device_profiles FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE jobs FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE places FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE push_subscriptions FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

-- Vercel uses atlas_app and can read only currently public job listings. It
-- has no INSERT, UPDATE, DELETE, or access to device/profile/push data.
GRANT SELECT ON TABLE jobs TO atlas_app;
--> statement-breakpoint
CREATE POLICY atlas_app_read_live_jobs ON jobs
  FOR SELECT
  TO atlas_app
  USING (
    status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
    AND (expires_at IS NULL OR expires_at > now())
  );
