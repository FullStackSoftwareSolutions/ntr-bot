"use client";

import { Badge } from "@next/components/ui/badge";
import {
  getPlayerName,
  getPlayerSkillNumber,
} from "@next/features/players/players.model";
import { api } from "@next/trpc/react";
import PlayerAvatar from "./PlayerAvatar";
import { type Player as PlayerType } from "@db/features/players/players.type";

type PlayerProps = {
  player: PlayerType;
};

const Player = ({ player }: PlayerProps) => {
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
            {getPlayerSkillNumber(player)}
          </Badge>
        </div>
      </div>
      {player.notes && (
        <div className="m-6">
          <p>{player.notes}</p>
        </div>
      )}
    </div>
  );
};

type PlayerByEmailProps = {
  email: string;
};

export const PlayerByEmail = ({ email }: PlayerByEmailProps) => {
  const { data: player } = api.players.getByEmail.useQuery({ email });

  if (!player) {
    return null;
  }

  return <Player player={player} />;
};

type PlayerByIdProps = {
  id: number;
};

export const PlayerById = ({ id }: PlayerByIdProps) => {
  const { data: player } = api.players.getById.useQuery({ id });

  if (!player) {
    return null;
  }

  return <Player player={player} />;
};

export default Player;
