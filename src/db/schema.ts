import { relations } from "drizzle-orm";
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
  primaryKey,
} from "drizzle-orm/pg-core";

export const players = pgTable(
  "players",
  {
    id: serial("id").unique().primaryKey(),
    fullName: varchar("full_name", { length: 256 }),
    email: varchar("email").unique(),
    phoneNumber: varchar("phone_number").unique(),
    admin: boolean("admin").default(false),
    skillLevel: varchar("skill_level"),
  },
  (players) => ({
    playersEmailIdx: index("players_email_idx").on(players.email),
    playersPhoneNumberIdx: index("players_phone_number_idx").on(
      players.phoneNumber
    ),
  })
);

export const playersRelations = relations(players, ({ many }) => ({
  bookings: many(bookings),
  skates: many(skates),
}));

export const skates = pgTable("skates", {
  id: serial("id").unique().primaryKey(),
  scheduledOn: timestamp("scheduled_on"),
  bookingId: integer("booking_id").references(() => bookings.id),
});

export const skatesRelations = relations(skates, ({ one, many }) => ({
  bookingId: one(bookings, {
    fields: [skates.bookingId],
    references: [bookings.id],
  }),
  players: many(players),
}));

export const playersToSkates = pgTable(
  "players_to_skates",
  {
    playerId: integer("player_id").references(() => players.id),
    skateId: integer("skate_id").references(() => skates.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.playerId, t.skateId] }),
  })
);

export const playersToSkatessRelations = relations(
  playersToSkates,
  ({ one }) => ({
    player: one(players, {
      fields: [playersToSkates.playerId],
      references: [players.id],
    }),
    skate: one(skates, {
      fields: [playersToSkates.skateId],
      references: [skates.id],
    }),
  })
);

export const bookings = pgTable("bookings", {
  id: serial("id").unique().primaryKey(),
  name: varchar("name"),
  numPlayers: integer("num_players"),
  location: varchar("location"),
  cost: numeric("cost"),
  scheduledTime: time("scheduled_time"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  bookedById: integer("booked_by_id").references(() => players.id),
});

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  bookedBy: one(players, {
    fields: [bookings.bookedById],
    references: [players.id],
  }),
  skates: many(skates),
}));

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
