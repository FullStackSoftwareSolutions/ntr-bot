import {
  bookings,
  players,
  playersToBookings,
  playersToSkates,
  skates,
} from "@db/db/schema";
import { db, jsonbAgg, jsonbBuildObject } from "@db/db";
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  gte,
  inArray,
  isNotNull,
  lt,
  SQL,
  sql,
} from "drizzle-orm";
import { BookingCreate } from "./bookings.type";
import { Positions, Skate } from "../skates/skates.type";
import { PgColumn } from "drizzle-orm/pg-core";

export const getAllBookings = async () =>
  db.query.bookings.findMany({
    orderBy: asc(bookings.startDate),
  });
export const getAllFutureBookings = async () =>
  db.query.bookings.findMany({
    where: gte(bookings.endDate, new Date().toISOString()),
    orderBy: asc(bookings.startDate),
  });
export const getAllPastBookings = async () =>
  db.query.bookings.findMany({
    where: lt(bookings.startDate, new Date().toISOString()),
    orderBy: desc(bookings.startDate),
  });

export const getBookingBySlug = async (slug: string) =>
  db.query.bookings.findFirst({
    with: {
      playersToBookings: {
        with: {
          player: true,
        },
      },
      skates: true,
    },
    where: eq(bookings.slug, slug),
  });
export const getBookingById = async (id: number) =>
  db.query.bookings.findFirst({
    with: {
      playersToBookings: {
        with: {
          player: true,
        },
      },
      skates: true,
    },
    where: eq(bookings.id, id),
  });

export const getBookingByName = async (name: string) =>
  db.query.bookings.findFirst({
    with: {
      playersToBookings: {
        with: {
          player: true,
        },
      },
    },
    where: eq(bookings.name, name),
  });

export const createBooking = async (bookingData: BookingCreate) => {
  const [booking] = await db.insert(bookings).values(bookingData).returning();
  return booking;
};

export const updateBookingPlayersAmountPaid = async (
  bookingId: number,
  playerIds: number[],
  amountPaid: string
) => {
  await db
    .update(playersToBookings)
    .set({ amountPaid })
    .where(
      and(
        eq(playersToBookings.bookingId, bookingId),
        inArray(playersToBookings.playerId, playerIds)
      )
    );
};

export const updateBooking = async (
  id: number,
  bookingData: Partial<BookingCreate>
) => {
  await db.update(bookings).set(bookingData).where(eq(bookings.id, id));
  return getBookingById(id);
};

export const updatePlayersForBooking = async (
  bookingId: number,
  removePlayerIds: number[],
  addPlayerIds: number[],
  position: string
) => {
  await db.transaction(async (tx) => {
    const bookingSkates = await tx.query.skates.findMany({
      where: eq(skates.bookingId, bookingId),
    });

    if (removePlayerIds.length > 0) {
      await tx
        .delete(playersToBookings)
        .where(
          and(
            eq(playersToBookings.bookingId, bookingId),
            inArray(playersToBookings.playerId, removePlayerIds)
          )
        );

      await tx.delete(playersToSkates).where(
        and(
          inArray(playersToSkates.playerId, removePlayerIds),
          inArray(
            playersToSkates.skateId,
            bookingSkates.map(({ id }) => id)
          )
        )
      );
    }

    if (addPlayerIds.length > 0) {
      await tx
        .insert(playersToBookings)
        .values(
          addPlayerIds.map((id) => ({ bookingId, playerId: id, position }))
        );

      for (const skate of bookingSkates) {
        await tx.insert(playersToSkates).values(
          addPlayerIds.map((id) => ({
            skateId: skate.id,
            playerId: id,
            position,
          }))
        );
      }
    }
  });
};

export const addPlayerToBooking = async ({
  bookingId,
  playerId,
  position,
}: {
  bookingId: number;
  playerId: number;
  position: Positions;
}) => {
  await db.transaction(async (tx) => {
    const bookingSkates = await tx.query.skates.findMany({
      where: eq(skates.bookingId, bookingId),
    });

    await tx
      .insert(playersToBookings)
      .values([{ bookingId, playerId, position }]);

    for (const skate of bookingSkates) {
      await tx.insert(playersToSkates).values([
        {
          skateId: skate.id,
          playerId,
          position,
        },
      ]);
    }
  });
};

export const updatePlayerBooking = async (
  playerBookingId: number,
  {
    amountPaid,
  }: {
    amountPaid: string | null;
  }
) =>
  db
    .update(playersToBookings)
    .set({ amountPaid })
    .where(eq(playersToBookings.id, playerBookingId))
    .returning();

export const deletePlayerFromBooking = async ({
  bookingId,
  playerId,
}: {
  bookingId: number;
  playerId: number;
}) => {
  await db.transaction(async (tx) => {
    const bookingSkates = await tx.query.skates.findMany({
      where: eq(skates.bookingId, bookingId),
    });

    await tx
      .delete(playersToBookings)
      .where(
        and(
          eq(playersToBookings.bookingId, bookingId),
          eq(playersToBookings.playerId, playerId)
        )
      );

    await tx.delete(playersToSkates).where(
      and(
        eq(playersToSkates.playerId, playerId),
        inArray(
          playersToSkates.skateId,
          bookingSkates.map(({ id }) => id)
        )
      )
    );
  });
};

export const getPlayersForBooking = async (bookingId: number) =>
  db
    .select({
      ...getTableColumns(players),
      playersToBookings: {
        amountPaid: playersToBookings.amountPaid,
      },
    })
    .from(players)
    .innerJoin(playersToBookings, eq(players.id, playersToBookings.playerId))
    .where(eq(playersToBookings.bookingId, bookingId));

export const deleteBooking = (bookingId: number) =>
  db.delete(bookings).where(eq(bookings.id, bookingId));

export const getSpotsNeedRefundForBooking = async (bookingId: number) =>
  db
    .select({
      ...getTableColumns(players),
      skates: jsonbAgg<Skate[]>(jsonbBuildObject(getTableColumns(skates))),
    })
    .from(playersToSkates)
    .innerJoin(skates, eq(playersToSkates.skateId, skates.id))
    .innerJoin(players, eq(playersToSkates.playerId, players.id))
    .where(
      and(
        eq(skates.bookingId, bookingId),
        isNotNull(playersToSkates.substitutePlayerId),
        eq(playersToSkates.paid, true),
        eq(playersToSkates.refunded, false)
      )
    )
    .groupBy(players.id);

export const refundSpotsForBookingPlayer = async ({
  bookingId,
  playerId,
}: {
  bookingId: number;
  playerId: number;
}) =>
  db
    .update(playersToSkates)
    .set({ refunded: true })
    .from(skates)
    .where(
      and(
        eq(playersToSkates.skateId, skates.id),
        eq(skates.bookingId, bookingId),
        isNotNull(playersToSkates.substitutePlayerId),
        eq(playersToSkates.paid, true),
        eq(playersToSkates.refunded, false),
        eq(playersToSkates.playerId, playerId)
      )
    );
