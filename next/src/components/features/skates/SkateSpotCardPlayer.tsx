import { type Player } from "@db/features/players/players.type";
import { Badge } from "@next/components/ui/badge";
import {
  getPlayerName,
  getPlayerSkillNumber,
} from "@next/features/players/players.model";
import PlayerAvatar from "../players/PlayerAvatar";

type SkateSpotCardPlayerProps = {
  showSkill?: boolean;
  player: Player;
};

const SkateSpotCardPlayer = ({
  player,
  showSkill,
}: SkateSpotCardPlayerProps) => {
  return (
    <div className="relative flex flex-wrap items-center gap-3 whitespace-pre-wrap p-2 text-xl font-semibold tracking-tight">
      <PlayerAvatar player={player} />
      {getPlayerName(player)}
      {showSkill && (
        <Badge variant="secondary" className="absolute right-0 top-0">
          {getPlayerSkillNumber(player)}
        </Badge>
      )}
    </div>
  );
};

export default SkateSpotCardPlayer;
