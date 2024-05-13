ALTER TABLE "players" ADD COLUMN "clerk_user_id" varchar;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "players_clerk_user_id_idx" ON "players" ("clerk_user_id");