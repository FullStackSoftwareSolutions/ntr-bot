ALTER TABLE "players_to_bookings" DROP CONSTRAINT "players_to_bookings_booking_id_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "skates" DROP CONSTRAINT "skates_booking_id_bookings_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_to_bookings" ADD CONSTRAINT "players_to_bookings_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skates" ADD CONSTRAINT "skates_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
