import {
  index,
  varchar,
  pgTable,
  serial,
  json,
  boolean,
} from "drizzle-orm/pg-core";

export const skaters = pgTable(
  "skaters",
  {
    id: serial("id").unique().primaryKey(),
    fullName: varchar("full_name", { length: 256 }),
    email: varchar("email").unique(),
    phoneNumber: varchar("phone_number").unique(),
    admin: boolean("admin").default(false),
  },
  (skaters) => ({
    skatersEmailIdx: index("skaters_email_idx").on(skaters.email),
    skatersPhoneNumberIdx: index("skaters_phone_number_idx").on(
      skaters.phoneNumber
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
