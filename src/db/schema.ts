import {
  index,
  varchar,
  pgTable,
  serial,
  json,
  boolean,
} from "drizzle-orm/pg-core";

export const players = pgTable(
  "players",
  {
    id: serial("id").unique().primaryKey(),
    fullName: varchar("full_name", { length: 256 }),
    email: varchar("email").unique(),
    phoneNumber: varchar("phone_number").unique(),
    admin: boolean("admin").default(false),
  },
  (players) => ({
    playersEmailIdx: index("players_email_idx").on(players.email),
    playersPhoneNumberIdx: index("players_phone_number_idx").on(
      players.phoneNumber
    ),
  })
);

export const whatsappAuth = pgTable(
  "whatsapp_auth",
  {
    key: varchar("key").unique().primaryKey(),
    data: json("data"),
  },
  (auth) => ({
    whatsappAuthKeyIdx: index("whatsapp_auth_key_idx").on(auth.key),
  })
);
