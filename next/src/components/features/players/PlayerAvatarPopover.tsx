import { type Player } from "@db/features/players/players.type";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@next/components/ui/popover";
import PlayerAvatar from "./PlayerAvatar";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import { Button } from "@next/components/ui/button";
import Link from "next/link";
import {
  getPlayerName,
  getPlayerSkillLevel,
  getPlayerSkillNumber,
} from "@next/features/players/players.model";
import { Badge } from "@next/components/ui/badge";

type PlayerAvatarPopoverProps = {
  player: Player;
  tabindex?: number;
};

const PlayerAvatarPopover = ({
  player,
  ...props
}: PlayerAvatarPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger {...props}>
        <PlayerAvatar player={player} />
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <div className="flex flex-col gap-8 p-4">
          <div className="flex items-center gap-3">
            <PlayerAvatar player={player} />
            <h3 className="whitespace-nowrap text-3xl">
              {getPlayerName(player)}
            </h3>
            <Badge variant="secondary">{getPlayerSkillNumber(player)}</Badge>
            <Badge variant="secondary">{getPlayerSkillLevel(player)}</Badge>
            <Button asChild variant="ghost" className="ml-auto">
              <Link href={`/player/${player.email}`}>
                <SquareArrowOutUpRightIcon />
              </Link>
            </Button>
          </div>
          <div className="text-foreground/40">
            <p className="text-primary-foreground">{player.fullName}</p>
            <p>{player.email}</p>
            <p>{player.phoneNumber}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PlayerAvatarPopover;
