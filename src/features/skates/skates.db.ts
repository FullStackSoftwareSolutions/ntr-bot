import { playersToSkates, skates } from "~/db/schema";
import { db } from "../../db";
import { and, asc, eq, inArray } from "drizzle-orm";

export const getSkateById = async (id: number) => {
  const [skate] = await db.query.skates.findMany({
    where: eq(skates.id, id),
    with: {
      booking: true,
      playersToSkates: {
        with: {
          player: true,
        },
      },
    },
  });
  if (!skate) {
    throw new Error(`Skate with id ${id} not found`);
  }

  return skate;
};

export const getAllSkates = async () => db.query.skates.findMany();
export const getSkatesForBooking = async (bookingId: number) =>
  db.query.skates.findMany({
    with: {
      playersToSkates: {
        with: {
          player: true,
        },
      },
    },
    where: eq(skates.bookingId, bookingId),
    orderBy: asc(skates.scheduledOn),
  });

export const createSkate = async (skate: {
  scheduledOn: Date;
  bookingId: number;
}) => {
  const [insertedSkate] = await db.insert(skates).values([skate]).returning();
  return insertedSkate;
};

export const updateSkate = async (id: number, skate: { scheduledOn: Date }) => {
  const [updatedSkate] = await db
    .update(skates)
    .set(skate)
    .where(eq(skates.id, id))
    .returning();
  return updatedSkate;
};

export const deleteSkatesForBooking = async (bookingId: number) =>
  db.delete(skates).where(eq(skates.bookingId, bookingId)).returning();

export const addPlayersToSkate = async (
  skateId: number,
  playerIds: number[]
) => {
  await db.insert(playersToSkates).values(
    playerIds.map((playerId) => ({
      skateId,
      playerId,
    }))
  );
};

export const removePlayersFromSkate = async (
  skateId: number,
  playerIds: number[]
) => {
  await db
    .delete(playersToSkates)
    .where(
      and(
        eq(playersToSkates.skateId, skateId),
        inArray(playersToSkates.playerId, playerIds)
      )
    );
};
