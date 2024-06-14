import { getBookingBySlug } from "@db/features/bookings/bookings.db";
import {
  addPlayerToSkate,
  deleteSkatePlayer,
  getAllSkates,
  getFutureSkates,
  getFutureSkatesForBooking,
  getPastSkates,
  getPastSkatesForBooking,
  getSkateById,
  getSkateBySlugAndBooking,
  getSkatesForBooking,
  updateSkatePlayer,
  updateSkateTeams,
} from "@db/features/skates/skates.db";
import { trpc } from "@whatsapp/trpc/client";
import {
  doesSkateHaveOpenSpotsIgnoringSubs,
  getSkateNextDropoutWithoutSub,
  getSkatePlayersForPositionIn,
  getSkatePlayersForPositionOutWithoutSub,
  getSkatePlayersForPositionSubsIn,
} from "./skates.model";
import { getAllGoalies, getAllPlayers } from "@db/features/players/players.db";
import { randomizeTeamsForSkate } from "./teams/skates.teams.controller";
import { Positions, Teams } from "@db/features/skates/skates.type";

export const getAllSkatesHandler = async ({
  type,
}: {
  type: "future" | "past" | "all";
}) => {
  if (type === "future") {
    return getFutureSkates();
  }
  if (type === "past") {
    return getPastSkates();
  }

  return getAllSkates();
};

export const getFutureSkatesHandler = async () => {
  return getFutureSkates();
};

export const getAllSkatesForBookingHandler = async ({
  bookingId,
  type,
}: {
  bookingId: number;
  type: "future" | "past" | "all";
}) => {
  if (type === "future") {
    return getFutureSkatesForBooking(bookingId);
  }
  if (type === "past") {
    return getPastSkatesForBooking(bookingId);
  }

  return getSkatesForBooking(bookingId);
};

export const getAllFutureSkatesForBookingHandler = async ({
  bookingId,
}: {
  bookingId: number;
}) => {
  return getFutureSkatesForBooking(bookingId);
};

export const getSkateBySlugsHandler = async ({
  bookingSlug,
  skateSlug,
}: {
  bookingSlug: string;
  skateSlug: string;
}) => {
  const booking = await getBookingBySlug(bookingSlug);
  if (!booking) {
    return null;
  }

  return getSkateBySlugAndBooking({
    slug: skateSlug,
    bookingId: booking.id,
  });
};

export const skateSubInPlayerHandler = async ({
  skateId,
  playerId,
  position,
}: {
  skateId: number;
  playerId: number;
  position: Positions;
}) => {
  const skate = await getSkateById(skateId);
  if (!skate) {
    throw new Error("No skate found!");
  }

  const areSpotsOpenIgnoringSubs = doesSkateHaveOpenSpotsIgnoringSubs(
    position,
    skate,
  );
  const dropoutsWithoutSub = getSkatePlayersForPositionOutWithoutSub(
    position,
    skate,
  );
  const dropoutPlayerToSkate = getSkateNextDropoutWithoutSub(position, skate);

  const isPlaying = areSpotsOpenIgnoringSubs || !!dropoutPlayerToSkate;

  // if dropout player is the same as the player to be added, remove the dropout
  const playerWithoutSub = dropoutsWithoutSub.find(
    (player) => player.player.id === playerId,
  );
  if (playerWithoutSub) {
    await updateSkatePlayer(playerWithoutSub.id, {
      droppedOutOn: null,
      substitutePlayerId: null,
    });
    return;
  }

  if (!areSpotsOpenIgnoringSubs && dropoutPlayerToSkate) {
    await updateSkatePlayer(dropoutPlayerToSkate.id, {
      substitutePlayerId: playerId,
    });
  }

  await addPlayerToSkate(skateId, playerId, {
    position,
  });

  if (isPlaying) {
    await shuffleTeamsSkateHandler({ skateId });
  }
};

export const skateDropOutPlayerHandler = async ({
  skateId,
  playerId,
  position,
}: {
  skateId: number;
  playerId: number;
  position: Positions;
}) => {
  const skate = await getSkateById(skateId);
  if (!skate) {
    throw new Error("No skate found!");
  }

  const playerToSkate = getSkatePlayersForPositionIn(position, skate).find(
    (playerToSkate) => playerToSkate.player.id === playerId,
  );
  if (!playerToSkate) {
    throw new Error("Player not found in skate!");
  }

  if (playerToSkate.droppedOutOn) {
    throw new Error("Player is already out!");
  }

  // need to look if there is a sub for this player
  const subPlayerToSkate = getSkatePlayersForPositionSubsIn(
    position,
    skate,
  )?.[0];

  await updateSkatePlayer(playerToSkate.id, {
    droppedOutOn: new Date(),
    substitutePlayerId: subPlayerToSkate?.player.id ?? null,
  });

  await shuffleTeamsSkateHandler({ skateId });
};

export const shuffleTeamsSkateHandler = async ({
  skateId,
}: {
  skateId: number;
}) => {
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

export const getSkateAvailableSubsHandler = async ({
  skateId,
  position,
}: {
  skateId: number;
  position: Positions;
}) => {
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
    (player) => !playersIn.some((playerIn) => playerIn.player.id === player.id),
  );

  return availableSubs;
};

export const announceSpotsSkateHandler = async ({
  skateId,
}: {
  skateId: number;
}) => {
  await trpc.skates.announceSpots.mutate({ skateId });
};

export const announceTeamsSkateHandler = async ({
  skateId,
}: {
  skateId: number;
}) => {
  await trpc.skates.announceTeams.mutate({ skateId });
};

export const skateDeleteSpotHandler = ({ id }: { id: number }) => {
  return deleteSkatePlayer(id);
};

export const skateUpdateSpotHandler = ({
  id,
  paid,
}: {
  id: number;
  paid: boolean;
}) => {
  return updateSkatePlayer(id, { paid });
};
