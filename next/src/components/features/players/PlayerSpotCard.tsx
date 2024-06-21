import { type Player } from "@db/features/players/players.type";
import { Badge } from "@next/components/ui/badge";
import {
  getPlayerName,
  getPlayerSkillNumber,
} from "@next/features/players/players.model";
import PlayerAvatar from "./PlayerAvatar";

type PlayerSpotCardProps = {
  showSkill?: boolean;
  player: Player;
};

const PlayerSpotCard = ({ player, showSkill }: PlayerSpotCardProps) => {
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

export default PlayerSpotCard;
