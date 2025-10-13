DROP INDEX IF EXISTS "players_email_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "players_phone_number_idx";

ALTER TABLE players DROP CONSTRAINT "players_email_unique";
ALTER TABLE players DROP CONSTRAINT "players_phone_number_unique";