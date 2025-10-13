import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { SQL, sql } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

console.log(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
);

export const connection = postgres(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
);
export const db = drizzle(connection, { schema });

export function jsonbAgg<T>(expression: SQL) {
  return sql<T>`jsonb_agg(${expression})`;
}

/**
 * @param shape Potential for SQL injections, so you shouldn't allow user-specified key names
 */
export function jsonbBuildObject<T extends Record<string, PgColumn | SQL>>(
  shape: T
) {
  const chunks: SQL[] = [];

  Object.entries(shape).forEach(([key, value]) => {
    if (chunks.length > 0) {
      chunks.push(sql.raw(","));
    }
    chunks.push(sql.raw(`'${key}',`));
    chunks.push(sql`${value}`);
  });

  return sql`jsonb_build_object(${sql.join(chunks)})`;
}
