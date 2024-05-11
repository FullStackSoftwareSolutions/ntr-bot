CREATE TABLE IF NOT EXISTS "players_to_skates" (
	"player_id" integer,
	"skate_id" integer,
	CONSTRAINT "players_to_skates_player_id_skate_id_pk" PRIMARY KEY("player_id","skate_id")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "num_players" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "skill_level" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_to_skates" ADD CONSTRAINT "players_to_skates_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_to_skates" ADD CONSTRAINT "players_to_skates_skate_id_skates_id_fk" FOREIGN KEY ("skate_id") REFERENCES "skates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
