import { asc, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "@db/db";
import { players } from "@db/db/schema";
import { PlayerCreate } from "./players.type";

export const getAllPlayersAndGoalies = async () =>
  db.query.players.findMany({
    orderBy: [asc(players.dateAdded), asc(players.id)],
  });
export const getAllPlayers = async () =>
  db.query.players.findMany({
    where: eq(players.isPlayer, true),
    orderBy: asc(players.dateAdded),
  });
export const getAllGoalies = async () =>
  db.query.players.findMany({
    where: eq(players.isGoalie, true),
    orderBy: asc(players.dateAdded),
  });
export const getAllPlayersSearch = async (search: string) =>
  db.query.players.findMany({
    where: or(
      ilike(players.fullName, `%${search}%`),
      ilike(players.nickname, `%${search}%`),
      ilike(players.email, `%${search}%`),
      ilike(players.phoneNumber, `%${search}%`)
    ),
    orderBy: asc(players.dateAdded),
  });
export const getPlayerByName = async (name: string) =>
  db.query.players.findFirst({
    where: or(eq(players.fullName, name), eq(players.nickname, name)),
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

export const getPlayerByEmail = async (email: string) =>
  db.query.players.findFirst({
    where: eq(players.email, email),
  });

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

export const deletePlayer = async (id: number) => {
  await db.delete(players).where(eq(players.id, id));
};
