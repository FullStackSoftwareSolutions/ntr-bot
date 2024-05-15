import {
  getAllPlayersAndGoalies,
  getPlayerByEmail,
  updatePlayer,
} from "@db/features/players/players.db";
import { type PlayerCreate } from "@db/features/players/players.type";

export const getAllPlayersHandler = async () => {
  return getAllPlayersAndGoalies();
};

export const getPlayerByEmailHandler = async ({ email }: { email: string }) => {
  return getPlayerByEmail(email);
};

export const updatePlayerHandler = async (
  playerId: number,
  updates: Partial<PlayerCreate>,
) => {
  return updatePlayer(playerId, updates);
};
