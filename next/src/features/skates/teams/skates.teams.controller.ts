import { type Player } from "@db/features/players/players.type";

import { getPlayerSkillNumber } from "@next/features/players/players.model";
import {
  getSkateGoaliesIn,
  getSkatePlayersIn,
  type Team,
  Teams,
} from "../skates.model";
import { type Skate } from "@db/features/skates/skates.type";

export const randomizeTeamsForSkate = (skate: Skate) => {
  const players = getSkatePlayersIn(skate).map(({ player }) => player);
  const shuffledAndSortedPlayers = sortPlayers(shufflePlayers(players));
  const goalies = getSkateGoaliesIn(skate).map(({ player }) => player);
  const shuffledGoalies = shufflePlayers(goalies);

  const teams: Team = { [Teams.Black]: [], [Teams.White]: [] };

  // randomize first team
  let firstTeam = Math.random() > 0.5 ? Teams.Black : Teams.White;

  shuffledAndSortedPlayers.forEach((player, index) => {
    if (index % 2 === 0) {
      teams[firstTeam].push(player);
    } else {
      teams[firstTeam === Teams.Black ? Teams.White : Teams.Black].push(player);

      const blackTotalScore = teams[Teams.Black].reduce(
        (acc, player) => acc + getPlayerSkillNumber(player),
        0,
      );
      const whiteTotalScore = teams[Teams.White].reduce(
        (acc, player) => acc + getPlayerSkillNumber(player),
        0,
      );
      if (blackTotalScore > whiteTotalScore) {
        firstTeam = Teams.White;
      } else {
        firstTeam = Teams.Black;
      }
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

const shufflePlayers = (players: Player[]): Player[] => {
  for (let i = players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp: Player = players[i]!;
    players[i] = players[j]!;
    players[j] = temp;
  }
  return players;
};

export const sortPlayers = (players: Player[]): Player[] => {
  return players.sort(
    (a, b) => getPlayerSkillNumber(b) - getPlayerSkillNumber(a),
  );
};
