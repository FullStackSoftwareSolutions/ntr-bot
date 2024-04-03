import { and, asc, eq, getTableColumns, inArray, like, or } from "drizzle-orm";
import { db } from "../../db";
import { players, playersToBookings } from "../../db/schema";
import { PlayerCreate } from "./players.type";

export const getAllPlayers = async () =>
  db.query.players.findMany({
    orderBy: asc(players.dateAdded),
  });
export const getAllPlayersSearch = async (search: string) =>
  db.query.players.findMany({
    where: or(
      like(players.fullName, `%${search}%`),
      like(players.nickname, `%${search}%`),
      like(players.email, `%${search}%`),
      like(players.phoneNumber, `%${search}%`)
    ),
    orderBy: asc(players.dateAdded),
  });
export const getPlayersByNames = async (names: string[]) =>
  db.query.players.findMany({
    where: or(
      inArray(players.fullName, names),
      inArray(players.nickname, names)
    ),
  });

export const getAllAdmins = async () =>
  db.query.players.findMany({
    where: eq(players.admin, true),
  });

export const getPlayerById = async (id: number) =>
  db.query.players.findFirst({
    where: eq(players.id, id),
  });

export const getPlayerByPhoneNumber = async (number: string) =>
  db.query.players.findFirst({
    where: eq(players.phoneNumber, number),
  });

export const getPlayersForBooking = async (bookingId: number) =>
  db
    .select(getTableColumns(players))
    .from(players)
    .innerJoin(playersToBookings, eq(players.id, playersToBookings.playerId))
    .where(eq(playersToBookings.bookingId, bookingId));

export const updatePlayersForBooking = async (
  bookingId: number,
  removePlayerIds: number[],
  addPlayerIds: number[]
) => {
  await db.transaction(async (tx) => {
    if (removePlayerIds.length > 0) {
      await tx
        .delete(playersToBookings)
        .where(
          and(
            eq(playersToBookings.bookingId, bookingId),
            inArray(playersToBookings.playerId, removePlayerIds)
          )
        );
    }

    if (addPlayerIds.length > 0) {
      await tx
        .insert(playersToBookings)
        .values(addPlayerIds.map((id) => ({ bookingId, playerId: id })));
    }
  });
};

export const createPlayer = async (playerData: PlayerCreate) => {
  const [player] = await db.insert(players).values(playerData).returning();
  if (!player) throw new Error("Failed to create player");

  return player;
};

export const updatePlayer = async (
  id: number,
  playerData: Partial<PlayerCreate>
) => {
  const [player] = await db
    .update(players)
    .set(playerData)
    .where(eq(players.id, id))
    .returning();
  if (!player) throw new Error("Failed to update player");

  return player;
};
