import { eq, getTableColumns } from "drizzle-orm";
import { db } from "../../db";
import { players, playersToBookings } from "../../db/schema";

export const getAllPlayers = async () => db.query.players.findMany();
export const getAllAdmins = async () =>
  db.query.players.findMany({
    where: eq(players.admin, true),
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
