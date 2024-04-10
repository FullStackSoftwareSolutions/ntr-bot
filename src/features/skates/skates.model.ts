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
export const getSkatePlayersWithSubs = (skate: Skate) => {
  return skate.playersToSkates.filter(
    ({ position, droppedOutOn, substitutePlayer }) =>
      position === Positions.Player && !!droppedOutOn && !!substitutePlayer
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

export const getSkateTitle = (skate: Skate) => {
  return `*${skate.booking.announceName}* ${getSkateTimeMessage(skate)}`;
};

export const getSkateGoaliesMessageLines = (
  skate: Skate,
  showOriginalPlayer = true,
  showCount = true
) => {
  const goaliesIn = [
    ...getSkateGoaliesIn(skate).map(
      ({ player }) =>
        `\`${getPlayerName(player)}\`${
          showOriginalPlayer
            ? getSkatePlayerSubStrikeoutMessage(skate, player)
            : ""
        }`
    ),
    ...getSkateGoaliesOutWithoutSub(skate).map(
      ({ player }) => `⚠️ ~${getPlayerName(player)}~`
    ),
  ];

  const totalGoalieSpots = getSkateTotalGoalieSpots(skate);
  const numGoalieSpotsFilled = getSkateNumGoalieSpotsFilled(skate);

  const numGoaliesMessage = `*Goalies*${
    showCount ? ` (${numGoalieSpotsFilled}/${totalGoalieSpots})` : ""
  }`;
  return [numGoaliesMessage, formatStringList(goaliesIn)];
};

export const getPlayersOutMessageLines = (skate: Skate) => {
  const playersOut = getSkatePlayersOut(skate).map(
    ({ player, substitutePlayer }) =>
      `${getPlayerName(player)}${
        substitutePlayer ? ` 👉 ${getPlayerName(substitutePlayer)}` : ""
      }`
  );

  if (playersOut.length === 0) {
    return [];
  }

  return ["🤕 *Out*", formatStringList(playersOut)];
};

export const getSkateMessage = (skate: Skate) => {
  const header = getSkateTitle(skate);

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
  const numGoalieSpotsOpen = getSkateNumGoalieSpotsOpen(skate);

  const totalPlayerSpots = getSkateTotalPlayerSpots(skate);
  const numPlayerSpotsFilled = getSkateNumPlayerSpotsFilled(skate);
  const numPlayerSpotsOpen = getSkateNumPlayerSpotsOpen(skate);

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

  if (!haveSkateTeamsBeenGenerated(skate)) {
    return stringJoin(
      header,
      ...statusMessages,
      "",
      numPlayersMessage,
      formatStringList(playersIn),
      "",
      ...getSkateGoaliesMessageLines(skate)
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

export const getSkateTeamsMessage = (skate: Skate, showSkillLevel = false) => {
  const players = getSkatePlayersIn(skate);
  let teamBlack = players
    .filter(({ team }) => team === Teams.Black)
    .map(({ player }) => player);
  let teamWhite = players
    .filter(({ team }) => team === Teams.White)
    .map(({ player }) => player);

  if (showSkillLevel) {
    teamBlack = sortPlayers(teamBlack);
    teamWhite = sortPlayers(teamWhite);
  } else {
    teamBlack = shufflePlayers(teamBlack);
    teamWhite = shufflePlayers(teamWhite);
  }

  const teamBlackHeader = `${getTeamTitle(Teams.Black)} (${teamBlack.length})`;
  const teamWhiteHeader = `${getTeamTitle(Teams.White)} (${teamWhite.length})`;

  const formatTeamList = (team: Player[]) =>
    formatStringList(
      team.map(
        (player) =>
          `${
            showSkillLevel ? `[${getPlayerSkillLevel(player)}] ` : ""
          }${getPlayerName(player)}`
      )
    );

  return stringJoin(
    getSkateTitle(skate),
    "",
    teamBlackHeader,
    formatTeamList(teamBlack),
    "",
    teamWhiteHeader,
    formatTeamList(teamWhite),
    "",
    ...getSkateGoaliesMessageLines(skate, false, false)
  );
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
  const players = getSkatePlayersIn(skate).map(({ player }) => player);
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
