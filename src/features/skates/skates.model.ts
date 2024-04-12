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

const getSkatePlayersForPosition = (
  positionChecked: Positions,
  skate: Skate
) => {
  return skate.playersToSkates
    .filter(({ position }) => position === positionChecked)
    .sort((a, b) => a.addedOn!.getTime() - b.addedOn!.getTime());
};
const getSkatePlayersForPositionIn = (position: Positions, skate: Skate) => {
  return getSkatePlayersForPosition(position, skate).filter(
    ({ droppedOutOn }) => !droppedOutOn
  );
};
const getSkatePlayersForPositionOut = (position: Positions, skate: Skate) => {
  return getSkatePlayersForPosition(position, skate).filter(
    ({ droppedOutOn }) => droppedOutOn
  );
};
const getSkatePlayersForPositionOutWithoutSub = (
  position: Positions,
  skate: Skate
) => {
  const numSpots = getSkateNumSpotsOpenForPosition(position, skate);

  const playersOut = getSkatePlayersForPositionOut(position, skate).filter(
    ({ substitutePlayer }) => !substitutePlayer
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

export const getSkateGoaliesIn = (skate: Skate) => {
  return getSkatePlayersForPositionIn(Positions.Goalie, skate).slice(
    0,
    skate.booking.numGoalies
  );
};
export const getSkateGoaliesSubsIn = (skate: Skate) => {
  return getSkatePlayersForPositionIn(Positions.Goalie, skate).slice(
    skate.booking.numGoalies
  );
};
export const getSkateGoaliesOut = (skate: Skate) => {
  return getSkatePlayersForPositionOut(Positions.Goalie, skate).sort(
    (a, b) => a.droppedOutOn!.getTime() - b.droppedOutOn!.getTime()
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
    skate.booking.numPlayers
  );
};
export const getSkatePlayersSubsIn = (skate: Skate) => {
  return getSkatePlayersForPositionIn(Positions.Player, skate).slice(
    skate.booking.numPlayers
  );
};
export const getSkatePlayersOut = (skate: Skate) => {
  return getSkatePlayersForPositionOut(Positions.Player, skate).sort(
    (a, b) => a.droppedOutOn!.getTime() - b.droppedOutOn!.getTime()
  );
};
export const getSkatePlayersOutWithoutSub = (skate: Skate) => {
  return getSkatePlayersForPositionOutWithoutSub(Positions.Player, skate);
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

export const getSlakateSubstitubeForPlayer = (skate: Skate, player: Player) => {
  return skate.playersToSkates.find(
    ({ substitutePlayer, droppedOutOn }) =>
      substitutePlayer?.id === player.id && !!droppedOutOn
  )?.player;
};

const getSkatePlayerSubStrikeoutMessage = (skate: Skate, player: Player) => {
  const sub = getSlakateSubstitubeForPlayer(skate, player);
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

export const getSkatePlayersMessageLines = (skate: Skate, showCount = true) => {
  const playersIn = [
    ...getSkatePlayersIn(skate).map(
      ({ player, addedOn }, index) =>
        `[${index + 1}] \`${getPlayerName(player)}\` ${dayjs(addedOn).format(
          "HH:MM:ss"
        )} ${getSkatePlayerSubStrikeoutMessage(skate, player)}`
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
      showSkillLevel ? `[${getPlayerSkillLevel(player)}] ` : ""
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

const shufflePlayers = (players: Player[]): Player[] => {
  for (let i = players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    let temp: Player = players[i] as Player;
    players[i] = players[j] as Player;
    players[j] = temp;
  }
  return players;
};

export const sortPlayers = (players: Player[]): Player[] => {
  return players.sort((a, b) =>
    getPlayerSkillLevel(a).localeCompare(getPlayerSkillLevel(b))
  );
};

export const randomizeTeamsForSkate = (skate: Skate) => {
  const players = getSkatePlayersIn(skate).map(({ player }) => player);
  const shuffledAndSortedPlayers = sortPlayers(shufflePlayers(players));
  const goalies = getSkateGoaliesIn(skate).map(({ player }) => player);
  const shuffledGoalies = shufflePlayers(goalies);

  const teams: Team = { [Teams.Black]: [], [Teams.White]: [] };

  shuffledAndSortedPlayers.forEach((player, index) => {
    if (index % 2 === 0) {
      teams[Teams.Black].push(player);
    } else {
      teams[Teams.White].push(player);
    }
  });
  shuffledGoalies.forEach((goalie, index) => {
    if (index % 2 === 0) {
      teams[Teams.Black].push(goalie);
    } else {
      teams[Teams.White].push(goalie);
    }
  });

  return teams;
};

export const getEarliestDropoutWithoutSub = (
  skate: Skate,
  subPosition: Positions
) => {
  return getSkatePlayersForPositionOutWithoutSub(subPosition, skate)?.[0];
};
