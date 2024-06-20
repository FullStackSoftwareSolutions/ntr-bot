"use client";

import { api } from "@next/trpc/react";
import PlayerCard from "../players/PlayerCard";

type BookingPlayersProps = {
  slug: string;
};

const BookingPlayers = ({ slug }: BookingPlayersProps) => {
  const { data: booking } = api.bookings.getBySlug.useQuery({ slug });

  if (!booking) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-start gap-4">
      {booking.playersToBookings.map(({ player }) => (
        <div key={player.id}>
          <PlayerCard player={player} />
        </div>
      ))}
    </div>
  );
};

export default BookingPlayers;
