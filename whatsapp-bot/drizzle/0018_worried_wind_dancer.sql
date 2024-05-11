ALTER TABLE "players_to_skates" DROP CONSTRAINT "players_to_skates_skate_id_skates_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_to_skates" ADD CONSTRAINT "players_to_skates_skate_id_skates_id_fk" FOREIGN KEY ("skate_id") REFERENCES "skates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
