import {
  createPlayer,
  getAllPlayersAndGoalies,
  getPlayerByEmail,
  getPlayerById,
  getPlayerByPhoneNumber,
  updatePlayer,
} from "@db/features/players/players.db";
import { type PlayerCreate } from "@db/features/players/players.type";

export const getAllPlayersHandler = async () => {
  return getAllPlayersAndGoalies();
};

export const getPlayerByIdHandler = async ({ id }: { id: number }) => {
  return getPlayerById(id);
};
export const getPlayerByEmailHandler = async ({ email }: { email: string }) => {
  return getPlayerByEmail(email);
};

export const canUseEmailHandler = async ({ email }: { email: string }) => {
  const player = await getPlayerByEmail(email);
  return !player;
};

export const getPlayerByPhoneNumberHandler = async ({
  phoneNumber,
}: {
  phoneNumber: string;
}) => {
  return getPlayerByPhoneNumber(phoneNumber);
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
