ALTER TABLE "bookings" DROP CONSTRAINT "bookings_booked_by_id_players_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "booked_by_user_id" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_booked_by_user_id_users_id_fk" FOREIGN KEY ("booked_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "booked_by_id";