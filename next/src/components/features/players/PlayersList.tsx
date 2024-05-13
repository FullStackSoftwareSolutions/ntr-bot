"use client";

import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import PlayerCard from "./PlayerCard";

type PlayersListProps = {
  className?: string;
};

const PlayersList = ({ className }: PlayersListProps) => {
  const { data: players } = api.players.getAll.useQuery();

  return (
    <div className={cn("flex flex-wrap items-start gap-4", className)}>
      {players?.map((player) => <PlayerCard key={player.id} player={player} />)}
    </div>
  );
};

export default PlayersList;
