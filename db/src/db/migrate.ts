"use server";

import { migrate as pgMigrate } from "drizzle-orm/postgres-js/migrator";
import { db, connection } from "./index";
import { fileURLToPath } from "url";
import path from "node:path";

export async function migrate() {
  const __filename = fileURLToPath(import.meta.url);
  const migrationsFolder = path.join(__filename, "../../../drizzle");

  // This will run migrations on the database, skipping the ones already applied
  await pgMigrate(db, {
    migrationsFolder,
  });

  // Don't forget to close the connection, otherwise the script will hang
  await connection.end();
}
