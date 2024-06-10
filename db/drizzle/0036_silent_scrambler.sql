CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" varchar,
	"github_id" integer
);
--> statement-breakpoint
DROP INDEX IF EXISTS "players_clerk_user_id_idx";--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "user_id" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "players_user_id_idx" ON "players" ("user_id");--> statement-breakpoint
ALTER TABLE "players" DROP COLUMN IF EXISTS "clerk_user_id";