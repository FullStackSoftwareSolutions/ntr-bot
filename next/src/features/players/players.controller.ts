import {
  createPlayer,
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

export const createPlayerHandler = async (input: PlayerCreate) => {
  const player = await createPlayer(input);

  if (!player) {
    throw new Error("Failed to create player");
  }

  return player;
};
