import {
  index,
  varchar,
  pgTable,
  serial,
  json,
  boolean,
  date,
  time,
  timestamp,
  decimal,
  numeric,
  integer,
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

export const skates = pgTable("skates", {
  id: serial("id").unique().primaryKey(),
  scheduledOn: timestamp("scheduled_on"),
  bookingId: integer("booking_id").references(() => bookings.id),
});

export const bookings = pgTable("bookings", {
  id: serial("id").unique().primaryKey(),
  location: varchar("location"),
  cost: numeric("cost"),
  scheduledTime: time("scheduled_time"),
  startDate: date("start_date"),
  endDate: date("end_date"),
});

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
