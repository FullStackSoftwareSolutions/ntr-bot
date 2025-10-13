"use client";

import BookingPaymentRefunds from "@next/components/features/bookings/payments/BookingPaymentRefunds";
import { api } from "@next/trpc/react";
import { useParams } from "next/navigation";

export default function BookingPaymentsTab() {
  const { bookingSlug } = useParams<{ bookingSlug: string }>();

  const { data: booking } = api.bookings.getBySlug.useQuery({
    slug: bookingSlug,
  });

  if (!booking) {
    return null;
  }

  return <BookingPaymentRefunds booking={booking} />;
}
