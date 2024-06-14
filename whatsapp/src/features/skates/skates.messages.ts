import dayjs from "dayjs";
import { Skate, Teams } from "@db/features/skates/skates.type";

import {
  formatList,
  formatStringList,
  stringJoin,
} from "../whatsapp/whatsapp.formatting";
import {
  getPlayerName,
  getPlayerSkillLevel,
  getPlayerSkillNumber,
} from "@next/features/players/players.model";
import { timeToEmoji } from "@formatting/time";
import { Player } from "@db/features/players/players.type";
import {
  getSkateGoaliesIn,
  getSkateGoaliesOutWithoutSub,
  getSkateGoaliesSubsIn,
  getSkateNumGoalieSpotsFilled,
  getSkateNumGoalieSpotsOpen,
  getSkateNumPlayerSpotsFilled,
  getSkateNumPlayerSpotsOpen,
  getSkatePlayersIn,
  getSkatePlayersOut,
  getSkatePlayersOutWithoutSub,
  getSkatePlayersSubsIn,
  getSkateSubstitubeForPlayer,
  getSkateTotalGoalieSpots,
  getSkateTotalPlayerSpots,
  getTeamTitle,
} from "@next/features/skates/skates.model";
import {
  shufflePlayers,
  sortPlayers,
} from "@next/features/skates/teams/skates.teams.controller";

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

const getSkatePlayerSubStrikeoutMessage = (skate: Skate, player: Player) => {
  const sub = getSkateSubstitubeForPlayer(skate, player);
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

  const goaliesList = formatStringList(goaliesIn, {
    minSeparatorLength: 13,
  });
  const goaliesListSeparatorLength = goaliesList.split("\n")[0]?.length ?? 100;

  const messageLines = [numGoaliesMessage, goaliesList];

  const skateExtraGoalies = getSkateGoaliesSubsIn(skate);
  if (skateExtraGoalies.length > 0) {
    const subsTitle = `Sub${
      skateExtraGoalies.length > 1 ? `s (${skateExtraGoalies.length})` : ""
    }`;
    const subsSepatorLength = Math.max(
      Math.floor((goaliesListSeparatorLength - subsTitle.length) / 2 - 1),
      2
    );

    const halfSeparatorLine = "━".repeat(subsSepatorLength);
    messageLines.push(
      `┣${halfSeparatorLine} *${subsTitle}* ${halfSeparatorLine}`
    );

    messageLines.push(
      formatStringList(
        skateExtraGoalies.map(({ player }) => `\`${getPlayerName(player)}\``),
        {
          hideSeparator: true,
        }
      )
    );
  }

  return messageLines;
};

export const getSkatePlayersMessageLines = (skate: Skate, showCount = true) => {
  const playersIn = [
    ...getSkatePlayersIn(skate).map(
      ({ player }) =>
        `\`${getPlayerName(player)}\` ${getSkatePlayerSubStrikeoutMessage(
          skate,
          player
        )}`
    ),
    ...getSkatePlayersOutWithoutSub(skate).map(
      ({ player }) => `⚠️ ~${getPlayerName(player)}~`
    ),
  ];

  const totalPlayerSpots = getSkateTotalPlayerSpots(skate);
  const numPlayerSpotsFilled = getSkateNumPlayerSpotsFilled(skate);

  const numPlayersMessage = `*Players*${
    showCount ? ` (${numPlayerSpotsFilled}/${totalPlayerSpots})` : ""
  }`;

  const playersList = formatStringList(playersIn, {
    minSeparatorLength: 13,
  });
  const playersListSeparatorLength = playersList.split("\n")[0]?.length ?? 100;

  const messageLines = [numPlayersMessage, playersList];

  const skateExtraPlayers = getSkatePlayersSubsIn(skate);
  if (skateExtraPlayers.length > 0) {
    const subsTitle = `Sub${
      skateExtraPlayers.length > 1 ? `s (${skateExtraPlayers.length})` : ""
    }`;
    const subsSepatorLength = Math.max(
      Math.floor((playersListSeparatorLength - subsTitle.length) / 2 - 1),
      2
    );

    const halfSeparatorLine = "━".repeat(subsSepatorLength);
    messageLines.push(
      `┣${halfSeparatorLine} *${subsTitle}* ${halfSeparatorLine}`
    );

    messageLines.push(
      formatStringList(
        skateExtraPlayers.map(({ player }) => `\`${getPlayerName(player)}\``),
        {
          hideSeparator: true,
        }
      )
    );
  }

  return messageLines;
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

  const numGoalieSpotsOpen = getSkateNumGoalieSpotsOpen(skate);
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

  return stringJoin(
    header,
    ...statusMessages,
    "",
    ...getSkatePlayersMessageLines(skate),
    "",
    ...getSkateGoaliesMessageLines(skate)
  );
};

export const getSkateTeamsMessage = (skate: Skate, showSkillLevel = false) => {
  const players = getSkatePlayersIn(skate);
  const goalies = getSkateGoaliesIn(skate);

  let teamBlackPlayers = players
    .filter(({ team }) => team === Teams.Black)
    .map(({ player }) => player);
  let teamWhitePlayers = players
    .filter(({ team }) => team === Teams.White)
    .map(({ player }) => player);

  if (showSkillLevel) {
    teamBlackPlayers = sortPlayers(teamBlackPlayers);
    teamWhitePlayers = sortPlayers(teamWhitePlayers);
  } else {
    teamBlackPlayers = shufflePlayers(teamBlackPlayers);
    teamWhitePlayers = shufflePlayers(teamWhitePlayers);
  }

  const teamBlackHeader = `${getTeamTitle(Teams.Black)} (${
    teamBlackPlayers.length
  } skaters)`;
  const teamWhiteHeader = `${getTeamTitle(Teams.White)} (${
    teamWhitePlayers.length
  } skaters)`;

  const formatPlayer = (player: Player) => {
    return `${
      showSkillLevel
        ? `[${getPlayerSkillLevel(player)}-${getPlayerSkillNumber(player)}] `
        : ""
    }\`${getPlayerName(player)}\``;
  };
  const formatTeamList = (players: Player[], goalie: Player) =>
    stringJoin(
      formatStringList(players.map(formatPlayer)),
      `*Goalie* ${formatPlayer(goalie)}`
    );

  const teamBlackGoalie = goalies.find(
    ({ team }) => team === Teams.Black
  )!.player;
  const teamWhiteGoalie = goalies.find(
    ({ team }) => team === Teams.White
  )!.player;

  return stringJoin(
    getSkateTitle(skate),
    "",
    teamBlackHeader,
    formatTeamList(teamBlackPlayers, teamBlackGoalie),
    "",
    teamWhiteHeader,
    formatTeamList(teamWhitePlayers, teamWhiteGoalie)
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
