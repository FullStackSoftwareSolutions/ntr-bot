import { index, varchar, pgTable, serial } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id"),
    fullName: varchar("full_name", { length: 256 }),
    email: varchar("email"),
  },
  (users) => ({
    emailIdx: index("email_idx").on(users.email),
  })
);
