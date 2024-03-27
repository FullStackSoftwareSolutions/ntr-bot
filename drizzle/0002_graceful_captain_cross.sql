ALTER TABLE "bookings" ADD COLUMN "booked_by_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_booked_by_id_players_id_fk" FOREIGN KEY ("booked_by_id") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
