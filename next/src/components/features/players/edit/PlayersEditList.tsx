"use client";

import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import PlayerEditCard from "./PlayerEditCard";

type PlayersEditListProps = {
  className?: string;
};

const PlayersEditList = ({ className }: PlayersEditListProps) => {
  const { data: players } = api.players.getAll.useQuery();

  return (
    <div className={cn("flex flex-wrap items-start gap-4", className)}>
      {players?.map((player) => (
        <PlayerEditCard key={player.id} player={player} />
      ))}
    </div>
  );
};

export default PlayersEditList;
