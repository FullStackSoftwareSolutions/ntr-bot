ALTER TABLE "players" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "phone_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "players" RENAME COLUMN "skill_level" TO "skill_level_letter";
ALTER TABLE "players" ADD COLUMN "skill_level" integer;--> statement-breakpoint

