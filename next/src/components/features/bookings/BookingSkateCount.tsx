"use client";

import { type BookingWithoutPlayers } from "@db/features/bookings/bookings.type";
import { Badge } from "@next/components/ui/badge";
import { api } from "@next/trpc/react";

type BookingSkateCountProps = {
  booking: BookingWithoutPlayers;
};

const BookingSkateCount = ({ booking }: BookingSkateCountProps) => {
  const { data: skates } = api.skates.getAllForBooking.useQuery({
    bookingId: booking.id,
    type: "all",
  });

  if (!skates) {
    return null;
  }

  return <Badge variant="outline">{`${skates.length} skates`}</Badge>;
};

export default BookingSkateCount;
