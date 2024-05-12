CREATE TABLE IF NOT EXISTS "players_to_bookings" (
	"player_id" integer,
	"booking_id" integer,
	CONSTRAINT "players_to_bookings_player_id_booking_id_pk" PRIMARY KEY("player_id","booking_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_to_bookings" ADD CONSTRAINT "players_to_bookings_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_to_bookings" ADD CONSTRAINT "players_to_bookings_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
