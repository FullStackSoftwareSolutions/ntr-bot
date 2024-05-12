import { relations, sql } from "drizzle-orm";
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
  numeric,
  integer,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

export const players = pgTable(
  "players",
  {
    id: serial("id").unique().primaryKey(),
    fullName: varchar("full_name", { length: 256 }).notNull(),
    nickname: varchar("nickname", { length: 256 }),
    email: varchar("email").unique().notNull(),
    phoneNumber: varchar("phone_number").notNull().unique(),
    skillLevel: varchar("skill_level"),
    notes: text("notes"),
    dateAdded: timestamp("date_added")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    admin: boolean("admin").notNull().default(false),
    isPlayer: boolean("is_player").notNull().default(true),
    isGoalie: boolean("is_goalie").notNull().default(false),
  },
  (players) => ({
    playersEmailIdx: index("players_email_idx").on(players.email),
    playersPhoneNumberIdx: index("players_phone_number_idx").on(
      players.phoneNumber
    ),
  })
);

export const playersRelations = relations(players, ({ many }) => ({
  playersToBookings: many(playersToBookings),
  playersToSkates: many(playersToSkates, {
    relationName: "skatePlayer",
  }),
  playersToSkatesSubstitute: many(playersToSkates, {
    relationName: "skateSubstitutePlayer",
  }),
}));

export const skates = pgTable("skates", {
  id: serial("id").unique().primaryKey(),
  slug: varchar("slug"),
  scheduledOn: timestamp("scheduled_on").notNull(),
  bookingId: integer("booking_id")
    .notNull()
    .references(() => bookings.id),
});

export const skatesRelations = relations(skates, ({ one, many }) => ({
  booking: one(bookings, {
    fields: [skates.bookingId],
    references: [bookings.id],
  }),
  playersToSkates: many(playersToSkates),
}));

export const playersToSkates = pgTable("players_to_skates", {
  id: serial("id").unique().primaryKey(),
  playerId: integer("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  skateId: integer("skate_id")
    .notNull()
    .references(() => skates.id, { onDelete: "cascade" }),
  substitutePlayerId: integer("substitute_player_id").references(
    () => players.id
  ),
  paid: boolean("paid").notNull().default(false),
  position: varchar("position").notNull().default("Player"),
  addedOn: timestamp("added_on")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  droppedOutOn: timestamp("dropped_out_on"),
  team: varchar("team"),
});

export const playersToSkatesRelations = relations(
  playersToSkates,
  ({ one }) => ({
    player: one(players, {
      fields: [playersToSkates.playerId],
      references: [players.id],
      relationName: "skatePlayer",
    }),
    substitutePlayer: one(players, {
      fields: [playersToSkates.substitutePlayerId],
      references: [players.id],
      relationName: "skateSubstitutePlayer",
    }),
    skate: one(skates, {
      fields: [playersToSkates.skateId],
      references: [skates.id],
    }),
  })
);

export const bookings = pgTable("bookings", {
  id: serial("id").unique().primaryKey(),
  slug: varchar("slug").notNull().unique(),
  name: varchar("name").notNull().unique(),
  announceName: varchar("announce_name"),
  numPlayers: integer("num_players").default(14).notNull(),
  numGoalies: integer("num_goalies").default(2).notNull(),
  location: varchar("location"),
  cost: numeric("cost"),
  costPerPlayer: numeric("cost_per_player"),
  costPerGoalie: numeric("cost_per_goalie").default("0").notNull(),
  scheduledTime: time("scheduled_time"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  bookedById: integer("booked_by_id").references(() => players.id),
  whatsAppGroupJid: varchar("whatsapp_group_jid"),
  notifyGroup: boolean("notify_group").notNull().default(false),
});

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  bookedBy: one(players, {
    fields: [bookings.bookedById],
    references: [players.id],
  }),
  skates: many(skates),
  playersToBookings: many(playersToBookings),
}));

export const playersToBookings = pgTable(
  "players_to_bookings",
  {
    playerId: integer("player_id")
      .notNull()
      .references(() => players.id),
    bookingId: integer("booking_id")
      .notNull()
      .references(() => bookings.id),
    amountPaid: numeric("amount_paid"),
    position: varchar("position").notNull().default("Player"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.playerId, t.bookingId] }),
  })
);

export const playersToBookingsRelations = relations(
  playersToBookings,
  ({ one }) => ({
    player: one(players, {
      fields: [playersToBookings.playerId],
      references: [players.id],
    }),
    booking: one(bookings, {
      fields: [playersToBookings.bookingId],
      references: [bookings.id],
    }),
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
