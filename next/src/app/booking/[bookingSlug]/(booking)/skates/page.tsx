"use client";

import BookingSkates from "@next/components/features/bookings/BookingSkates";
import { useParams } from "next/navigation";

export default function BookingSkatesTab() {
  const { bookingSlug } = useParams<{ bookingSlug: string }>();

  return <BookingSkates slug={bookingSlug} />;
}
