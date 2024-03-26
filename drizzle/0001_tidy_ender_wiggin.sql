ALTER TABLE "skaters" DROP CONSTRAINT "skaters_whatsapp_jid_unique";--> statement-breakpoint
ALTER TABLE "skaters" DROP COLUMN IF EXISTS "whatsapp_jid";