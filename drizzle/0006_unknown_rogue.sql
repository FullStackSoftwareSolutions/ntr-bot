ALTER TABLE "bookings" ADD COLUMN "cost_per_player" numeric;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "nickname" varchar(256);--> statement-breakpoint
ALTER TABLE "players_to_bookings" ADD COLUMN "amount_paid" numeric;--> statement-breakpoint
ALTER TABLE "players_to_skates" ADD COLUMN "team" varchar;