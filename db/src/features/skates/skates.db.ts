import { playersToSkates, skates } from "@db/db/schema";
import { db } from "@db/db";
import { and, asc, desc, eq, gt, gte, inArray, lt } from "drizzle-orm";
import { Positions } from "./skates.type";

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
export const getSkateBySlugAndBooking = async ({
  slug,
  bookingId,
}: {
  slug: string;
  bookingId: number;
}) => {
  const [skate] = await db.query.skates.findMany({
    where: and(eq(skates.slug, slug), eq(skates.bookingId, bookingId)),
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

export const getAllSkates = async () =>
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
  });

export const getFutureSkates = async () =>
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
    where: and(gte(skates.scheduledOn, new Date())),
    orderBy: asc(skates.scheduledOn),
  });
export const getPastSkates = async () =>
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
    where: and(lt(skates.scheduledOn, new Date())),
    orderBy: desc(skates.scheduledOn),
  });

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
      gte(skates.scheduledOn, new Date())
    ),
    orderBy: asc(skates.scheduledOn),
  });
export const getPastSkatesForBooking = async (bookingId: number) =>
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
      lt(skates.scheduledOn, new Date())
    ),
    orderBy: desc(skates.scheduledOn),
  });

export const createSkate = async (skate: {
  slug: string;
  scheduledOn: Date;
  bookingId: number;
}) => {
  const [insertedSkate] = await db.insert(skates).values([skate]).returning();
  return insertedSkate;
};

export const updateSkate = async (
  id: number,
  skate: { scheduledOn?: Date; slug?: string }
) => {
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
  players: {
    playerId: number;
    position: string;
  }[]
) => {
  await db.insert(playersToSkates).values(
    players.map(({ playerId, position }) => ({
      skateId,
      playerId,
      position,
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
    paid,
    refunded,
  }: {
    team?: string | null;
    substitutePlayerId?: number | null;
    droppedOutOn?: Date | null;
    paid?: boolean;
    refunded?: boolean;
  }
) => {
  await db
    .update(playersToSkates)
    .set({ team, substitutePlayerId, droppedOutOn, paid, refunded })
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

export const deleteSkatePlayer = async (playerToSkateId: number) =>
  db.delete(playersToSkates).where(eq(playersToSkates.id, playerToSkateId));

export const deleteSkate = async (skateId: number) =>
  db.delete(skates).where(eq(skates.id, skateId));
