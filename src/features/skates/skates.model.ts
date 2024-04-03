import dayjs from "dayjs";
import { Skate } from "./skates.type";

import { formatList, stringJoin } from "../whatsapp/whatsapp.formatting";
import { getPlayerName, getPlayerSkillLevel } from "../players/players.model";
import { timeToEmoji } from "~/formatting/time.emoji";
import { Player } from "../players/players.type";

export enum Teams {
  Black = "⬛ Black",
  White = "⬜ White",
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
    "🏒 *Skates*",
    formatList(
      skates.map((skate) => ({
        id: skate.id,
        scheduledOn: getSkateTimeMessage(skate),
        players: getPlayersText(skate),
      }))
    )
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
