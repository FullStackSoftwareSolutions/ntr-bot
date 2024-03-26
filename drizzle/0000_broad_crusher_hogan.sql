CREATE TABLE IF NOT EXISTS "users" (
	"id" serial NOT NULL,
	"full_name" varchar(256),
	"email" varchar
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");