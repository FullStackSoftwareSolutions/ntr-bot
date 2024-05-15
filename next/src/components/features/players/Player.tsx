"use client";

import { Badge } from "@next/components/ui/badge";
import {
  getPlayerName,
  getPlayerSkillLevel,
  getPlayerSkillNumber,
} from "@next/features/players/players.model";
import { api } from "@next/trpc/react";
import PlayerAvatar from "./PlayerAvatar";
import PlayerSkillEditForm from "./edit/PlayerSkillEditForm";

type PlayerProps = {
  email: string;
};

const Player = ({ email }: PlayerProps) => {
  const { data: player } = api.players.getByEmail.useQuery({ email });

  if (!player) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-16">
        <div className="flex items-center gap-4">
          <PlayerAvatar player={player} />
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl">{getPlayerName(player)}</h1>
            <div className="flex gap-1">
              {player.isGoalie && <Badge variant="outline">Goalie</Badge>}
              {player.isPlayer && <Badge variant="outline">Player</Badge>}
            </div>
          </div>
        </div>
        <div className="my-4 text-foreground/40">
          <p className="text-foreground">{player.fullName}</p>
          <p>{player.email}</p>
          <p>{player.phoneNumber}</p>
        </div>
        <div className="flex gap-1">
          <Badge className="self-center text-2xl" variant="secondary">
            {getPlayerSkillLevel(player)}
          </Badge>
          <Badge className="self-center text-2xl" variant="secondary">
            {getPlayerSkillNumber(player)}
          </Badge>
        </div>
      </div>
      {player.notes && (
        <div className="mt-4">
          <p>{player.notes}</p>
        </div>
      )}
      <PlayerSkillEditForm player={player} />
    </div>
  );
};

export default Player;