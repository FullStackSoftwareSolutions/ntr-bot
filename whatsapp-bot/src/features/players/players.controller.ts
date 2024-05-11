import { createPlayer } from "./players.db";
import { PlayerCreate } from "./players.type";

export const createPlayerHandler = async (playerData: PlayerCreate) => {
  const player = await createPlayer(playerData);

  if (!player) {
    throw new Error("Failed to create player");
  }

  return player;
};
