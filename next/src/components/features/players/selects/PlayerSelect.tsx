"use client";

import { type Player } from "@db/features/players/players.type";
import { CommandPopoverVirtualized } from "@next/components/ui/command-popover-virtualized";
import { getPlayerName } from "@next/features/players/players.model";
import { api } from "@next/trpc/react";

type PlayerSelectProps = {
  className?: string;
  value: number | null;
  onChange: (playerId: number | null) => void;
};

const PlayerSelect = ({ className, value, onChange }: PlayerSelectProps) => {
  const { data: players, isLoading } = api.players.getAll.useQuery();

  const selectedPlayer = players?.find(({ id }) => id === value);

  return (
    <CommandPopoverVirtualized<Player>
      className={className}
      options={players ?? []}
      isLoading={isLoading}
      getOptionLabel={(player) => getPlayerName(player)}
      value={selectedPlayer ?? null}
      onValueChange={(val) => {
        onChange((val as Player | null)?.id ?? null);
      }}
    />
  );
};

export default PlayerSelect;
