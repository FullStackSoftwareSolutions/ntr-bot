ALTER TABLE "users" ADD COLUMN "email" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "admin" boolean DEFAULT false NOT NULL;