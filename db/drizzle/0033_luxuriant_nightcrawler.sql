UPDATE bookings SET slug = REPLACE(announce_name, ' ', '');

ALTER TABLE "bookings" ALTER COLUMN "slug"
SET
NOT NULL;--> statement-breakpoint
ALTER TABLE "skates" ADD COLUMN "slug" varchar;