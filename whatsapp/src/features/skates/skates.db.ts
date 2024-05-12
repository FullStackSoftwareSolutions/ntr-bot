import { playersToSkates, skates } from "@whatsapp/db/schema";
import { db } from "../../db";
import { and, asc, eq, gt, inArray } from "drizzle-orm";

export const getSkateById = async (id: number) => {
  const [skate] = await db.query.skates.findMany({
    where: eq(skates.id, id),
    with: {
      booking: true,
      playersToSkates: {
        with: {
          player: true,
          substitutePlayer: true,
        },
        orderBy: asc(playersToSkates.addedOn),
      },
    },
  });
  return skate;
};

export const getAllSkates = async () => db.query.skates.findMany();
export const getSkatesForBooking = async (bookingId: number) =>
  db.query.skates.findMany({
    with: {
      booking: true,
      playersToSkates: {
        with: {
          player: true,
          substitutePlayer: true,
        },
        orderBy: asc(playersToSkates.addedOn),
      },
    },
    where: eq(skates.bookingId, bookingId),
    orderBy: asc(skates.scheduledOn),
  });

export const getFutureSkatesForBooking = async (bookingId: number) =>
  db.query.skates.findMany({
    with: {
      booking: true,
      playersToSkates: {
        with: {
          player: true,
          substitutePlayer: true,
        },
        orderBy: asc(playersToSkates.addedOn),
      },
    },
    where: and(
      eq(skates.bookingId, bookingId),
      gt(skates.scheduledOn, new Date())
    ),
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

export const updateSkatePlayer = async (
  playerToSkateId: number,
  {
    team,
    substitutePlayerId,
    droppedOutOn,
  }: {
    team?: string | null;
    substitutePlayerId?: number | null;
    droppedOutOn?: Date | null;
  }
) => {
  await db
    .update(playersToSkates)
    .set({ team, substitutePlayerId, droppedOutOn })
    .where(eq(playersToSkates.id, playerToSkateId));
};

export const addPlayerToSkate = async (
  skateId: number,
  playerId: number,
  {
    team,
    substitutePlayerId,
    droppedOutOn,
    position,
  }: {
    team?: string | null;
    substitutePlayerId?: number | null;
    droppedOutOn?: Date | null;
    position: string;
  }
) => {
  await db
    .insert(playersToSkates)
    .values([
      { skateId, playerId, team, substitutePlayerId, droppedOutOn, position },
    ]);
};

export const updateSkateTeams = async (
  skateId: number,
  teams: {
    playerId: number;
    team: string;
  }[]
) => {
  await db.transaction(async (tx) => {
    for (const { playerId, team } of teams) {
      await tx
        .update(playersToSkates)
        .set({ team })
        .where(
          and(
            eq(playersToSkates.skateId, skateId),
            eq(playersToSkates.playerId, playerId)
          )
        );
    }
  });
};
