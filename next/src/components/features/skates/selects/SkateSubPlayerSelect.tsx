"use client";

import { type Player } from "@db/features/players/players.type";
import { type Skate } from "@db/features/skates/skates.type";
import { CommandPopoverVirtualized } from "@next/components/ui/command-popover-virtualized";
import { getPlayerName } from "@next/features/players/players.model";
import { type Positions } from "@next/features/skates/skates.model";
import { api } from "@next/trpc/react";

type SkateSubPlayerSelectProps = {
  className?: string;
  skate: Skate;
  position: Positions;
  value: number | null;
  onChange: (playerId: number | null) => void;
};

const SkateSubPlayerSelect = ({
  className,
  skate,
  position,
  value,
  onChange,
}: SkateSubPlayerSelectProps) => {
  const { data: players, isLoading } = api.skates.getAvailableSubs.useQuery({
    skateId: skate.id,
    position,
  });

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

SkateSubPlayerSelect.displayName = "SkateSubPlayerSelect";

export default SkateSubPlayerSelect;
