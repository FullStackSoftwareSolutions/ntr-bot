ALTER TABLE "players_to_skates" RENAME COLUMN "replacing_player_id" TO "substitute_player_id";--> statement-breakpoint
ALTER TABLE "players_to_skates" DROP CONSTRAINT "players_to_skates_replacing_player_id_players_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_to_skates" ADD CONSTRAINT "players_to_skates_substitute_player_id_players_id_fk" FOREIGN KEY ("substitute_player_id") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
