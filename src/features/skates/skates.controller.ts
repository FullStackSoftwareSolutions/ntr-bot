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
  getSkatePlayersForPositionIn,
  getSkatePlayersInWithSubs,
  getSkatePlayersSubsIn,
  Positions,
  randomizeTeamsForSkate,
  Teams,
} from "./skates.model";

export const updateSkatePlayerOutHandler = async (
  skateId: number,
  position: Positions,
  playerId: number
) => {
  const skate = await getSkateById(skateId);
  if (!skate) {
    throw new Error("No skate found!");
  }

  const playerToSkate = getSkatePlayersForPositionIn(position, skate).find(
    (playerToSkate) => playerToSkate.player.id === playerId
  );
  if (!playerToSkate) {
    throw new Error("Player not found in skate!");
  }

  if (playerToSkate.droppedOutOn) {
    throw new Error("Player is already out!");
  }

  // need to look if there is a sub for this player
  const subPlayerToSkate = getSkatePlayersSubsIn(skate)?.[0];

  await updateSkatePlayer(playerToSkate.id, {
    droppedOutOn: new Date(),
    substitutePlayerId: subPlayerToSkate?.player.id ?? null,
  });
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

  const dropoutPlayerToSkate = getEarliestDropoutWithoutSub(skate, position);
  // if (!dropoutPlayer) {
  //   throw new Error("No dropout player found!");
  // }

  // if dropout player is the same as the player to be added, remove the dropout
  if (dropoutPlayerToSkate?.player.id === playerId) {
    await updateSkatePlayer(dropoutPlayerToSkate.id, {
      droppedOutOn: null,
      substitutePlayerId: null,
    });
    return;
  }

  if (dropoutPlayerToSkate) {
    await updateSkatePlayer(dropoutPlayerToSkate.id, {
      substitutePlayerId: playerId,
    });
  }
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

  const allPlayers =
    position === Positions.Goalie
      ? await getAllGoalies()
      : await getAllPlayers();
  const playersIn = getSkatePlayersForPositionIn(position, skate);
  const availableSubs = allPlayers.filter(
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
