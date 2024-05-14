import { type Player } from "@db/features/players/players.type";
import { Avatar, AvatarFallback } from "@next/components/ui/avatar";
import { getPlayerInitials } from "@next/features/players/players.model";

type PlayerAvatarProps = {
  player: Player;
};

const PlayerAvatar = ({ player }: PlayerAvatarProps) => {
  return (
    <Avatar className="text-base font-normal">
      <AvatarFallback>{getPlayerInitials(player)}</AvatarFallback>
    </Avatar>
  );
};

export default PlayerAvatar;
