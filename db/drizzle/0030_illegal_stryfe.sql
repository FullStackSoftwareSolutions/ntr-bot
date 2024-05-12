ALTER TABLE "players_to_skates" ADD COLUMN "id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "players_to_skates" ADD CONSTRAINT "players_to_skates_id_unique" UNIQUE("id");