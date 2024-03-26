CREATE TABLE IF NOT EXISTS "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"location" varchar,
	"cost" numeric,
	"scheduled_time" time,
	"start_date" date,
	"end_date" date,
	CONSTRAINT "bookings_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skates" (
	"id" serial PRIMARY KEY NOT NULL,
	"scheduled_on" timestamp,
	"booking_id" integer,
	CONSTRAINT "skates_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skates" ADD CONSTRAINT "skates_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
