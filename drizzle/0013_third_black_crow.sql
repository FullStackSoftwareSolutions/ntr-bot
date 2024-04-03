ALTER TABLE "bookings" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "cost_per_player";--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_name_unique" UNIQUE("name");