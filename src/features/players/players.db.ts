import { eq } from "drizzle-orm";
import { db } from "../../db";
import { players } from "../../db/schema";

export const getAllPlayers = async () => db.query.players.findMany();
export const getAllAdmins = async () =>
  db.query.players.findMany({
    where: eq(players.admin, true),
  });

export const getPlayerByPhoneNumber = async (number: string) =>
  db.query.players.findFirst({
    where: eq(players.phoneNumber, number),
  });
