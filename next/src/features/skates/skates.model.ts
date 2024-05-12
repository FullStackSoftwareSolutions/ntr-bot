import { type Player } from "@db/features/players/players.type";
import { type Skate } from "@db/features/skates/skates.type";
import { formatDateTimeWithEmoji } from "@formatting/dates";

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
