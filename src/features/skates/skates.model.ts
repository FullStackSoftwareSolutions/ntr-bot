import dayjs from "dayjs";
import { Skate } from "./skates.type";

import {
  formatList,
  formatStringList,
  stringJoin,
} from "../whatsapp/whatsapp.formatting";
import { getPlayerName, getPlayerSkillLevel } from "../players/players.model";
import { timeToEmoji } from "~/formatting/time.emoji";
import { Player } from "../players/players.type";

export enum Teams {
  Black = "⬛ Black",
  White = "⬜ White",
}

export enum Positions {
  Player = "Player",
  Goalie = "Goalie",
}

export type Team = {
  [Teams.Black]: Player[];
  [Teams.White]: Player[];
};

export const getSkateTimeMessage = (skate: Skate) => {
  return `${timeToEmoji(skate.scheduledOn)} ${dayjs(skate.scheduledOn).format(
    `MMM D h:mma`
  )}`;
};

export const getSkatesMessage = (skates: Skate[]) => {
  return stringJoin(
    `🏒 *Skate${skates.length > 1 ? "s" : ""}*`,
    formatList(
      skates.map((skate) => ({
        id: skate.id,
        scheduledOn: getSkateTimeMessage(skate),
        players: getPlayersText(skate),
      }))
    )
  );
};

const haveSkateTeamsBeenGenerated = (skate: Skate) => {
  return skate.playersToSkates.some(({ team }) => team !== null);
};

export const getSkateGoaliesIn = (skate: Skate) => {
  return skate.playersToSkates.filter(
    ({ position, droppedOutOn }) =>
      position === Positions.Goalie && !droppedOutOn
  );
};
export const getSkateGoaliesOut = (skate: Skate) => {
  return skate.playersToSkates
    .filter(
      ({ position, droppedOutOn }) =>
        position === Positions.Goalie && droppedOutOn
    )
    .sort((a, b) => a.droppedOutOn!.getTime() - b.droppedOutOn!.getTime());
};
export const getSkateGoaliesOutWithoutSub = (skate: Skate) => {
  return skate.playersToSkates.filter(
    ({ position, droppedOutOn, substitutePlayer }) =>
      position === Positions.Goalie && droppedOutOn && !substitutePlayer
  );
};

export const getSkatePlayersIn = (skate: Skate) => {
  return skate.playersToSkates.filter(
    ({ position, droppedOutOn }) =>
      position === Positions.Player && !droppedOutOn
  );
};
export const getSkatePlayersOut = (skate: Skate) => {
  return skate.playersToSkates
    .filter(
      ({ position, droppedOutOn }) =>
        position === Positions.Player && droppedOutOn
    )
    .sort((a, b) => a.droppedOutOn!.getTime() - b.droppedOutOn!.getTime());
};
export const getSkatePlayersOutWithoutSub = (skate: Skate) => {
  return skate.playersToSkates.filter(
    ({ position, droppedOutOn, substitutePlayer }) =>
      position === Positions.Player && droppedOutOn && !substitutePlayer
  );
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

export const getSkatePlayerSub = (skate: Skate, player: Player) => {
  return skate.playersToSkates.find(
    ({ substitutePlayer, droppedOutOn }) =>
      substitutePlayer?.id === player.id && !!droppedOutOn
  )?.player;
};

const getSkatePlayerSubStrikeoutMessage = (skate: Skate, player: Player) => {
  const sub = getSkatePlayerSub(skate, player);
  if (!sub) {
    return "";
  }
  return ` 👈 ~${getPlayerName(sub)}~`;
};

export const getSkateMessage = (skate: Skate) => {
  const header = `*${skate.booking!.announceName}* ${getSkateTimeMessage(
    skate
  )}`;

  const goaliesIn = [
    ...getSkateGoaliesIn(skate).map(
      ({ player }) =>
        `\`${getPlayerName(player)}\`${getSkatePlayerSubStrikeoutMessage(
          skate,
          player
        )}`
    ),
    ...getSkateGoaliesOutWithoutSub(skate).map(
      ({ player }) => `⚠️ ~${getPlayerName(player)}~`
    ),
  ];

  const playersIn = [
    ...getSkatePlayersIn(skate).map(
      ({ player }) =>
        `\`${getPlayerName(player)}\`${getSkatePlayerSubStrikeoutMessage(
          skate,
          player
        )}`
    ),
    ...getSkatePlayersOutWithoutSub(skate).map(
      ({ player }) => `⚠️ ~${getPlayerName(player)}~`
    ),
  ];
  const playersOut = getSkatePlayersOut(skate).map(
    ({ player, substitutePlayer }) =>
      `${getPlayerName(player)}${
        substitutePlayer ? ` 👉 ${getPlayerName(substitutePlayer)}` : ""
      }`
  );

  const totalPlayerSpots = getSkateTotalPlayerSpots(skate);
  const numPlayerSpotsFilled = getSkateNumPlayerSpotsFilled(skate);
  const numPlayerSpotsOpen = getSkateNumPlayerSpotsOpen(skate);

  const totalGoalieSpots = getSkateTotalGoalieSpots(skate);
  const numGoalieSpotsFilled = getSkateNumGoalieSpotsFilled(skate);
  const numGoalieSpotsOpen = getSkateNumGoalieSpotsOpen(skate);

  const fullMessage = `🛑 *Full - No spots open*`;
  const playersNeededMessage = `⚠️ *${numPlayerSpotsOpen} player spot${
    numPlayerSpotsOpen > 1 ? "s" : ""
  } open*`;
  const goaliesNeededMessage = `⚠️ *${numGoalieSpotsOpen} goalie spot${
    numGoalieSpotsOpen > 1 ? "s" : ""
  } open*`;

  const statusMessages = [];
  if (numPlayerSpotsOpen === 0 && numGoalieSpotsOpen === 0) {
    statusMessages.push(fullMessage);
  } else {
    if (numPlayerSpotsOpen > 0) {
      statusMessages.push(playersNeededMessage);
    }
    if (numGoalieSpotsOpen > 0) {
      statusMessages.push(goaliesNeededMessage);
    }
  }

  const numPlayersMessage = `*Players* (${numPlayerSpotsFilled}/${totalPlayerSpots})`;
  const numGoaliesMessage = `*Goalies* (${numGoalieSpotsFilled}/${totalGoalieSpots})`;

  const outMessage =
    playersOut.length > 0 ? ["", "🤕 *Out*", formatStringList(playersOut)] : [];

  if (!haveSkateTeamsBeenGenerated(skate)) {
    return stringJoin(
      header,
      ...statusMessages,
      "",
      numPlayersMessage,
      formatStringList(playersIn),
      "",
      numGoaliesMessage,
      formatStringList(goaliesIn)
    );
  }

  return formatList([
    {
      id: skate.id,
      scheduledOn: getSkateTimeMessage(skate),
      players: getPlayersText(skate),
    },
  ]);
};

const getPlayersText = (skate: Skate) => {
  if (skate.playersToSkates.length === 0) {
    return "None";
  }

  const playerNames = skate.playersToSkates
    .map(({ player }) => getPlayerName(player))
    .join(", ");
  return `(${skate.playersToSkates.length}) ${playerNames}`;
};

const shufflePlayers = (players: Player[]): Player[] => {
  for (let i = players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    let temp: Player = players[i] as Player;
    players[i] = players[j] as Player;
    players[j] = temp;
  }
  return players;
};

const sortPlayers = (players: Player[]): Player[] => {
  return players.sort((a, b) =>
    getPlayerSkillLevel(a).localeCompare(getPlayerSkillLevel(b))
  );
};

export const randomizeTeamsForSkate = (skate: Skate) => {
  const players = skate.playersToSkates.map(({ player }) => player);
  const shuffledAndSortedPlayers = sortPlayers(shufflePlayers(players));

  const teams: Team = { [Teams.Black]: [], [Teams.White]: [] };

  shuffledAndSortedPlayers.forEach((player, index) => {
    if (index % 2 === 0) {
      teams[Teams.Black].push(player);
    } else {
      teams[Teams.White].push(player);
    }
  });

  return teams;
};

export const getEarliestDropoutWithoutSub = (
  skate: Skate,
  subPosition: Positions
) => {
  return skate.playersToSkates
    .filter(
      ({ droppedOutOn, substitutePlayer, position }) =>
        droppedOutOn && !substitutePlayer && position === subPosition
    )
    .sort((a, b) => a.droppedOutOn!.getTime() - b.droppedOutOn!.getTime())[0]
    ?.player;
};
