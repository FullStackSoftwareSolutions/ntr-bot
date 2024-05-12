CREATE TABLE IF NOT EXISTS "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(256),
	"email" varchar,
	"phone_number" varchar,
	"admin" boolean DEFAULT false,
	CONSTRAINT "players_id_unique" UNIQUE("id"),
	CONSTRAINT "players_email_unique" UNIQUE("email"),
	CONSTRAINT "players_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "whatsapp_auth" (
	"key" varchar PRIMARY KEY NOT NULL,
	"data" json,
	CONSTRAINT "whatsapp_auth_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "players_email_idx" ON "players" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "players_phone_number_idx" ON "players" ("phone_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "whatsapp_auth_key_idx" ON "whatsapp_auth" ("key");