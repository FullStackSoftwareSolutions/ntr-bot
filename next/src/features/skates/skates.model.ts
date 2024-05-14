import { type Player } from "@db/features/players/players.type";
import { type Skate } from "@db/features/skates/skates.type";
import { formatDateTimeWithEmoji } from "@formatting/dates/index";

export enum Teams {
  Black = "black",
  White = "white",
}

const teamTitles = {
  [Teams.Black]: "⬛ Black - Home",
  [Teams.White]: "⬜ White - Away",
};
export const getTeamTitle = (team: Teams) => teamTitles[team];

export enum Positions {
  Player = "Player",
  Goalie = "Goalie",
}

export type Team = {
  [Teams.Black]: Player[];
  [Teams.White]: Player[];
};

export const getSkateTimeMessage = (skate: Skate) => {
  return formatDateTimeWithEmoji(skate.scheduledOn);
};

export const getSkatePlayersForPosition = (
  positionChecked: Positions,
  skate: Skate,
) => {
  return skate.playersToSkates
    .filter(({ position }) => (position as Positions) === positionChecked)
    .sort((a, b) => {
      if (!a.droppedOutOn && b.droppedOutOn) {
        return -1;
      }
      if (a.droppedOutOn && !b.droppedOutOn) {
        return 1;
      }

      if (a.droppedOutOn && b.droppedOutOn) {
        return a.droppedOutOn.getTime() - b.droppedOutOn.getTime();
      }
      return a.addedOn.getTime() - b.addedOn.getTime();
    });
};
export const getSkatePlayersForPositionIn = (
  position: Positions,
  skate: Skate,
) => {
  return getSkatePlayersForPosition(position, skate).filter(
    ({ droppedOutOn }) => !droppedOutOn,
  );
};
export const getSkatePlayersForPositionSubsIn = (
  position: Positions,
  skate: Skate,
) => {
  return getSkatePlayersForPositionIn(position, skate).slice(
    getSkateTotalSpotsForPosition(position, skate),
  );
};
const getSkatePlayersForPositionOut = (position: Positions, skate: Skate) => {
  return getSkatePlayersForPosition(position, skate).filter(
    ({ droppedOutOn }) => droppedOutOn,
  );
};
const getSkatePlayersForPositionOutWithoutSub = (
  position: Positions,
  skate: Skate,
) => {
  const numSpots = getSkateNumSpotsOpenForPosition(position, skate);

  const playersOut = getSkatePlayersForPositionOut(position, skate).filter(
    ({ substitutePlayer }) => !substitutePlayer,
  );
  return playersOut
    .slice(0, numSpots)
    .sort((a, b) => a.droppedOutOn!.getTime() - b.droppedOutOn!.getTime());
};
const getSkateNumSpotsOpenForPosition = (position: Positions, skate: Skate) => {
  if (position === Positions.Goalie) {
    return getSkateNumGoalieSpotsOpen(skate);
  }
  return getSkateNumPlayerSpotsOpen(skate);
};
const getSkateTotalSpotsForPosition = (position: Positions, skate: Skate) => {
  if (position === Positions.Goalie) {
    return getSkateTotalGoalieSpots(skate);
  }
  return getSkateTotalPlayerSpots(skate);
};
export const getSkateGoaliesInWithSubs = (skate: Skate) => {
  return getSkatePlayersForPositionIn(Positions.Goalie, skate);
};
export const getSkateGoaliesIn = (skate: Skate) => {
  return getSkatePlayersForPositionIn(Positions.Goalie, skate).slice(
    0,
    skate.booking.numGoalies,
  );
};
export const getSkateGoaliesSubsIn = (skate: Skate) => {
  return getSkatePlayersForPositionIn(Positions.Goalie, skate).slice(
    skate.booking.numGoalies,
  );
};
export const getSkateGoaliesOut = (skate: Skate) => {
  return getSkatePlayersForPositionOut(Positions.Goalie, skate).sort(
    (a, b) => a.droppedOutOn!.getTime() - b.droppedOutOn!.getTime(),
  );
};
export const getSkateGoaliesOutWithoutSub = (skate: Skate) => {
  return getSkatePlayersForPositionOutWithoutSub(Positions.Goalie, skate);
};

export const getSkatePlayersInWithSubs = (skate: Skate) => {
  return getSkatePlayersForPositionIn(Positions.Player, skate);
};
export const getSkatePlayersIn = (skate: Skate) => {
  return getSkatePlayersForPositionIn(Positions.Player, skate).slice(
    0,
    skate.booking.numPlayers,
  );
};
export const getSkatePlayersSubsIn = (skate: Skate) => {
  return getSkatePlayersForPositionIn(Positions.Player, skate).slice(
    skate.booking.numPlayers,
  );
};
export const getSkatePlayersOut = (skate: Skate) => {
  return getSkatePlayersForPositionOut(Positions.Player, skate).sort(
    (a, b) => a.droppedOutOn!.getTime() - b.droppedOutOn!.getTime(),
  );
};
export const getSkatePlayersOutWithoutSub = (skate: Skate) => {
  return getSkatePlayersForPositionOutWithoutSub(Positions.Player, skate);
};
export const getSkatePlayersWithSubs = (skate: Skate) => {
  return skate.playersToSkates.filter(
    ({ position, droppedOutOn, substitutePlayer }) =>
      (position as Positions) === Positions.Player &&
      !!droppedOutOn &&
      !!substitutePlayer,
  );
};
export const getSkatePlayersWithSubsUnpaid = (skate: Skate) => {
  return getSkatePlayersWithSubs(skate).filter(({ substitutePlayer }) => {
    return (
      getSkatePlayersForPosition(Positions.Player, skate)
        .reverse()
        .find(({ player }) => player.id === substitutePlayer?.id)?.paid ===
      false
    );
  });
};

export const getSkatePlayersAndGoaliesIn = (skate: Skate) => {
  return skate.playersToSkates.filter(({ droppedOutOn }) => !droppedOutOn);
};
export const getSkateTotalGoalieSpots = (skate: Skate) => {
  return skate.booking?.numGoalies ?? 0;
};
export const getSkateNumGoalieSpotsFilled = (skate: Skate) => {
  return getSkateGoaliesIn(skate).length;
};
export const getSkateNumGoalieSpotsOpen = (skate: Skate) => {
  return getSkateTotalGoalieSpots(skate) - getSkateNumGoalieSpotsFilled(skate);
};
export const getSkateTotalPlayerSpots = (skate: Skate) => {
  return skate.booking?.numPlayers ?? 0;
};
export const getSkateNumPlayerSpotsFilled = (skate: Skate) => {
  return getSkatePlayersIn(skate).length;
};
export const getSkateNumPlayerSpotsOpen = (skate: Skate) => {
  return getSkateTotalPlayerSpots(skate) - getSkateNumPlayerSpotsFilled(skate);
};

export const getSkateSubstitubeForPlayer = (skate: Skate, player: Player) => {
  return skate.playersToSkates.find(
    ({ substitutePlayer, droppedOutOn }) =>
      substitutePlayer?.id === player.id && !!droppedOutOn,
  )?.player;
};
