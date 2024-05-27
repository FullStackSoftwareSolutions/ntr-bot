import { getBookingBySlug } from "@db/features/bookings/bookings.db";
import {
  addPlayerToSkate,
  getAllSkates,
  getFutureSkates,
  getFutureSkatesForBooking,
  getSkateById,
  getSkateBySlugAndBooking,
  getSkatesForBooking,
  updateSkatePlayer,
} from "@db/features/skates/skates.db";
import { trpc } from "@whatsapp/trpc/client";
import {
  doesSkateHaveOpenSpotsIgnoringSubs,
  getSkateNextDropoutWithoutSub,
  getSkatePlayersForPositionIn,
  getSkatePlayersForPositionSubsIn,
  Positions,
} from "./skates.model";
import { getAllGoalies, getAllPlayers } from "@db/features/players/players.db";

export const getAllSkatesHandler = async () => {
  return getAllSkates();
};

export const getFutureSkatesHandler = async () => {
  return getFutureSkates();
};

export const getAllSkatesForBookingHandler = async ({
  bookingId,
}: {
  bookingId: number;
}) => {
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

  const dropoutPlayerToSkate = getSkateNextDropoutWithoutSub(skate, position);

  // if dropout player is the same as the player to be added, remove the dropout
  if (dropoutPlayerToSkate?.player.id === playerId) {
    await updateSkatePlayer(dropoutPlayerToSkate.id, {
      droppedOutOn: null,
      substitutePlayerId: null,
    });
    return;
  }

  if (!doesSkateHaveOpenSpotsIgnoringSubs(position, skate)) {
    if (dropoutPlayerToSkate) {
      await updateSkatePlayer(dropoutPlayerToSkate.id, {
        substitutePlayerId: playerId,
      });
    }
  }

  await addPlayerToSkate(skateId, playerId, {
    position,
  });
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
};

export const announceSpotsSkateHandler = async ({
  skateId,
}: {
  skateId: number;
}) => {
  await trpc.skates.announceSpots.mutate({ skateId });
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
