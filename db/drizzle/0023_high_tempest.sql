ALTER TABLE "players" ADD COLUMN "is_player" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "is_goalie" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "players_to_bookings" ADD COLUMN "position" varchar DEFAULT 'Player' NOT NULL;--> statement-breakpoint
ALTER TABLE "players_to_skates" ADD COLUMN "position" varchar DEFAULT 'Player' NOT NULL;