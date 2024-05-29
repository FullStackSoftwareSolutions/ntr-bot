import { type Player } from "@db/features/players/players.type";
import PlayerAvatarPopover from "../players/PlayerAvatarPopover";
import { Badge } from "@next/components/ui/badge";
import {
  getPlayerName,
  getPlayerSkillNumber,
} from "@next/features/players/players.model";

type SkateSpotCardPlayerProps = {
  player: Player;
};

const SkateSpotCardPlayer = ({ player }: SkateSpotCardPlayerProps) => {
  return (
    <div className="relative flex flex-wrap items-center gap-3 whitespace-pre-wrap p-2 text-xl font-semibold tracking-tight">
      <PlayerAvatarPopover player={player} />
      {getPlayerName(player)}
      <Badge variant="secondary" className="absolute right-0 top-0 hidden">
        {getPlayerSkillNumber(player)}
      </Badge>
    </div>
  );
};

export default SkateSpotCardPlayer;
