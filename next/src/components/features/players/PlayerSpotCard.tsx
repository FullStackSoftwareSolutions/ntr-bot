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
  className?: string;
  padding?: "none" | "small" | "default";
  layout?: "default" | "compact" | "horizontal";
  showName?: boolean;
  rightContent?: React.ReactNode;
};

const PlayerSpotCard = ({ 
  player, 
  showSkill, 
  className = "",
  padding = "default",
  layout = "default",
  showName = true,
  rightContent
}: PlayerSpotCardProps) => {
  const paddingClasses = {
    none: "",
    small: "p-1",
    default: "p-2"
  };

  const layoutClasses = {
    default: "relative flex flex-wrap items-center gap-3 whitespace-pre-wrap text-xl font-semibold tracking-tight",
    compact: "flex items-center gap-2 text-base font-medium",
    horizontal: "flex items-center justify-between gap-3 text-xl font-semibold tracking-tight"
  };

  return (
    <div className={`${layoutClasses[layout]} ${paddingClasses[padding]} ${className}`}>
      <div className="flex items-center gap-3">
        <PlayerAvatar player={player} />
        {showName && getPlayerName(player)}
      </div>
      
      {/* Right side content */}
      <div className="flex items-center gap-2">
        {rightContent}
        {showSkill && (
          <Badge variant="secondary">
            {getPlayerSkillNumber(player)}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default PlayerSpotCard;
