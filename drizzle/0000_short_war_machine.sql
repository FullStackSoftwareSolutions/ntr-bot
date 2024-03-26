CREATE TABLE IF NOT EXISTS "skaters" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(256),
	"email" varchar,
	"phone_number" varchar,
	"whatsapp_jid" varchar,
	"admin" boolean DEFAULT false,
	CONSTRAINT "skaters_id_unique" UNIQUE("id"),
	CONSTRAINT "skaters_email_unique" UNIQUE("email"),
	CONSTRAINT "skaters_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "skaters_whatsapp_jid_unique" UNIQUE("whatsapp_jid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "whatsapp_auth" (
	"key" varchar PRIMARY KEY NOT NULL,
	"data" json,
	CONSTRAINT "whatsapp_auth_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "skaters_email_idx" ON "skaters" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "skaters_phone_number_idx" ON "skaters" ("phone_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "whatsapp_auth_key_idx" ON "whatsapp_auth" ("key");