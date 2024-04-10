import { getAllPlayers } from "../players/players.db";
import { addPlayerToSkate, getSkateById, updateSkatePlayer } from "./skates.db";
import {
  getEarliestDropoutWithoutSub,
  getSkatePlayersIn,
} from "./skates.model";

export const updateSkatePlayerOutHandler = async (
  skateId: number,
  playerId: number
) => {
  const skate = await getSkateById(skateId);
  if (!skate) {
    throw new Error("No skate found!");
  }

  const player = skate.playersToSkates.find(
    (playerToSkate) => playerToSkate.playerId === playerId
  );
  if (!player) {
    throw new Error("Player not found in skate!");
  }

  if (player.droppedOutOn) {
    throw new Error("Player is already out!");
  }

  await updateSkatePlayer(skateId, playerId, { droppedOutOn: new Date() });
};

export const addSkateSubPlayerHandler = async (
  skateId: number,
  playerId: number
) => {
  const skate = await getSkateById(skateId);
  if (!skate) {
    throw new Error("No skate found!");
  }

  const dropoutPlayer = getEarliestDropoutWithoutSub(skate);
  if (!dropoutPlayer) {
    throw new Error("No dropout player found!");
  }

  console.log(dropoutPlayer.id, playerId);
  if (dropoutPlayer.id === playerId) {
    await updateSkatePlayer(skateId, playerId, {
      droppedOutOn: null,
      substitutePlayerId: null,
    });
    return;
  }

  await updateSkatePlayer(skateId, dropoutPlayer.id, {
    substitutePlayerId: playerId,
  });
  await addPlayerToSkate(skateId, playerId);
};

export const getSkateAvailableSubsHandler = async (skateId: number) => {
  const skate = await getSkateById(skateId);
  if (!skate) {
    throw new Error("No skate found!");
  }

  const players = await getAllPlayers();
  const playersIn = getSkatePlayersIn(skate);
  const availableSubs = players.filter(
    (player) => !playersIn.some((playerIn) => playerIn.player.id === player.id)
  );

  return availableSubs;
};
