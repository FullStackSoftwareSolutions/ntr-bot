"use client";

import { type Player } from "@db/features/players/players.type";
import { Card, CardTitle } from "@next/components/ui/card";
import { getPlayerName } from "@next/features/players/players.model";
import PlayerAvatarPopover from "../PlayerAvatarPopover";
import PlayerSkillEditForm from "./PlayerSkillEditForm";

type PlayerEditCardProps = {
  player: Player;
};

const PlayerEditCard = ({ player }: PlayerEditCardProps) => {
  return (
    <Card className="flex w-full overflow-hidden hover:bg-card/90 sm:w-auto">
      <CardTitle className="relative flex min-w-0 max-w-48 flex-1 flex-col items-start gap-2 border-r p-4 pr-6">
        <div className="flex items-center gap-2">
          <PlayerAvatarPopover tabIndex={-1} player={player} />
          {getPlayerName(player)}
        </div>
        {player.notes && (
          <p className="text-sm text-foreground/40">{player.notes}</p>
        )}
      </CardTitle>
      <PlayerSkillEditForm player={player} />
    </Card>
  );
};

export default PlayerEditCard;
