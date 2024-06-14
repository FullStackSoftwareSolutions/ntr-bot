import { Teams, type Skate } from "@db/features/skates/skates.type";
import { getSkateTeams } from "@next/features/skates/skates.model";
import SkateShuffleTeamsButton from "./SkateShuffleTeamsButton";
import { Card } from "@next/components/ui/card";
import SkateSpotCardPlayer from "./SkateSpotCardPlayer";
import { type Player } from "@db/features/players/players.type";
import { getPlayerSkillNumber } from "@next/features/players/players.model";
import { Badge } from "@next/components/ui/badge";

type SkateTeamsProps = {
  skate: Skate;
};

const SkateTeams = ({ skate }: SkateTeamsProps) => {
  const teams = getSkateTeams(skate);

  return (
    <div className="flex flex-col px-4">
      <SkateShuffleTeamsButton className="mb-4 self-start" skate={skate} />

      <div className="grid gap-12 md:grid-cols-2">
        <SkateTeam
          team="Team White"
          players={teams[Teams.White].players}
          goalies={teams[Teams.White].goalies}
        />
        <SkateTeam
          team="Team Black"
          players={teams[Teams.Black].players}
          goalies={teams[Teams.Black].goalies}
        />
      </div>
    </div>
  );
};

type SkateTeamProps = {
  team: string;
  players: Player[];
  goalies: Player[];
};

const SkateTeam = ({ team, players, goalies }: SkateTeamProps) => {
  const totalSkillLevel = players.reduce(
    (acc, player) => acc + getPlayerSkillNumber(player),
    0,
  );

  const sortedPlayers = players.sort((a, b) => {
    return getPlayerSkillNumber(b) - getPlayerSkillNumber(a);
  });

  return (
    <div className="flex flex-col">
      <h3 className="flex items-center gap-2 self-start text-2xl">
        {team}
        <Badge variant="secondary" className="">
          {totalSkillLevel}
        </Badge>
      </h3>
      <div className="my-4 grid grid-cols-2 items-stretch justify-stretch gap-2 md:grid-cols-2 lg:grid-cols-3">
        {sortedPlayers.map((player) => (
          <Card key={player.id} className="p-2">
            <SkateSpotCardPlayer showSkill player={player} />
          </Card>
        ))}
      </div>
      <h4 className="self-start text-xl">Goalie</h4>
      <div className="mb-4 mt-2 grid grid-cols-2 items-stretch justify-stretch gap-2 md:grid-cols-2 lg:grid-cols-3">
        {goalies.map((player) => (
          <Card key={player.id} className="p-2">
            <SkateSpotCardPlayer showSkill player={player} />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SkateTeams;
