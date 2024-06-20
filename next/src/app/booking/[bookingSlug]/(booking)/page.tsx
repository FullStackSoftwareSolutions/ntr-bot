"use client";

import BookingPlayers from "@next/components/features/bookings/BookingPlayers";
import { useParams } from "next/navigation";

export default function BookingPlayersTab() {
  const { bookingSlug } = useParams<{ bookingSlug: string }>();

  return <BookingPlayers slug={bookingSlug} />;
}
