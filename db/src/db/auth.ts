import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from ".";
import { sessions, users } from "./schema";

export const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users); // your adapter
