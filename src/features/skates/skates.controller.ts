import {
  getAllGoalies,
  getAllPlayers,
  getAllPlayersAndGoalies,
} from "../players/players.db";
import {
  addPlayerToSkate,
  getSkateById,
  updateSkatePlayer,
  updateSkateTeams,
} from "./skates.db";
import {
  getEarliestDropoutWithoutSub,
  getSkatePlayersIn,
  Positions,
  randomizeTeamsForSkate,
  Teams,
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
  playerId: number,
  position: Positions
) => {
  const skate = await getSkateById(skateId);
  if (!skate) {
    throw new Error("No skate found!");
  }

  const dropoutPlayer = getEarliestDropoutWithoutSub(skate, position);
  if (!dropoutPlayer) {
    throw new Error("No dropout player found!");
  }

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
  await addPlayerToSkate(skateId, playerId, {
    position,
  });
};

export const getSkateAvailableSubsHandler = async (
  skateId: number,
  position: Positions
) => {
  const skate = await getSkateById(skateId);
  if (!skate) {
    throw new Error("No skate found!");
  }

  const players =
    position === Positions.Goalie
      ? await getAllGoalies()
      : await getAllPlayers();

  const playersIn = getSkatePlayersIn(skate);
  const availableSubs = players.filter(
    (player) => !playersIn.some((playerIn) => playerIn.player.id === player.id)
  );

  return availableSubs;
};

export const shuffleSkateTeamsHandler = async (skateId: number) => {
  const skate = await getSkateById(skateId);
  if (!skate) {
    throw new Error("No skate found!");
  }

  const teams = randomizeTeamsForSkate(skate);
  const playersWithTeam = [
    ...teams[Teams.Black].map((player) => ({
      playerId: player.id,
      team: Teams.Black,
    })),
    ...teams[Teams.White].map((player) => ({
      playerId: player.id,
      team: Teams.White,
    })),
  ];

  await updateSkateTeams(skateId, playersWithTeam);

  return await getSkateById(skateId);
};
