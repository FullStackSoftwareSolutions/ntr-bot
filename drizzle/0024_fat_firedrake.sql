ALTER TABLE "bookings" ALTER COLUMN "num_players" SET DEFAULT 14;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "num_players" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "num_goalies" integer DEFAULT 2 NOT NULL;