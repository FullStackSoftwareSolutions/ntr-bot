"use client";

import BookingSpots from "@next/components/features/bookings/spots/BookingSpots";
import { api } from "@next/trpc/react";
import { useParams } from "next/navigation";

export default function BookingPlayersTab() {
  const { bookingSlug } = useParams<{ bookingSlug: string }>();

  const { data: booking } = api.bookings.getBySlug.useQuery({
    slug: bookingSlug,
  });

  if (!booking) {
    return null;
  }

  return <BookingSpots booking={booking} />;
}
