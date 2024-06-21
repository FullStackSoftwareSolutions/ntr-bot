"use client";

import { type Booking } from "@db/features/bookings/bookings.type";
import { type Player } from "@db/features/players/players.type";
import { Positions } from "@db/features/skates/skates.type";
import { CommandPopoverVirtualized } from "@next/components/ui/command-popover-virtualized";
import { getPlayerName } from "@next/features/players/players.model";
import { api } from "@next/trpc/react";

type BookingAddPlayerSelectProps = {
  className?: string;
  booking: Booking;
  position: Positions;
  value: number | null;
  onChange: (playerId: number | null) => void;
};

const BookingAddPlayerSelect = ({
  className,
  value,
  onChange,
  booking,
  position,
}: BookingAddPlayerSelectProps) => {
  const { data: players, isLoading } = api.players.getAll.useQuery();

  const availablePlayers = players?.filter(
    ({ id, isGoalie, isPlayer }) =>
      ((position === Positions.Goalie && isGoalie) ||
        (position === Positions.Player && isPlayer)) &&
      !booking.playersToBookings.some(({ player }) => player.id === id),
  );

  const selectedPlayer = availablePlayers?.find(({ id }) => id === value);

  return (
    <CommandPopoverVirtualized<Player>
      className={className}
      options={availablePlayers ?? []}
      isLoading={isLoading}
      getOptionLabel={(player) => getPlayerName(player)}
      value={selectedPlayer ?? null}
      onValueChange={(val) => {
        onChange((val as Player | null)?.id ?? null);
      }}
    />
  );
};

BookingAddPlayerSelect.displayName = "BookingAddPlayerSelect";

export default BookingAddPlayerSelect;
