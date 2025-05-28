import {
  createPlayer,
  deletePlayer,
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
  const player = await getPlayerByEmail(email);
  return player ?? null;
};

export const canUseEmailHandler = async ({
  email,
  playerId,
}: {
  email: string;
  playerId?: number;
}) => {
  if (playerId) {
    const existingPlayer = await getPlayerById(playerId);
    if (existingPlayer?.email === email) {
      return true;
    }
  }

  const player = await getPlayerByEmail(email);
  return !player;
};

export const getPlayerByPhoneNumberHandler = async ({
  phoneNumber,
}: {
  phoneNumber: string;
}) => {
  const player = await getPlayerByPhoneNumber(phoneNumber);
  return player ?? null;
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

export const deletePlayerHandler = async (id: number) => {
  return deletePlayer(id);
};
