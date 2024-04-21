ALTER TABLE "players_to_skates" ADD COLUMN "replacing_player_id" integer;--> statement-breakpoint
ALTER TABLE "players_to_skates" ADD COLUMN "dropped_out_on" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_to_skates" ADD CONSTRAINT "players_to_skates_replacing_player_id_players_id_fk" FOREIGN KEY ("replacing_player_id") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
