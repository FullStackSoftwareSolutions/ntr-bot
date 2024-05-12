"use client";

import { api } from "@next/trpc/react";
import BookingSkatesList from "../skates/BookingSkatesList";

type BookingProps = {
  slug: string;
};

const Booking = ({ slug }: BookingProps) => {
  const { data: booking } = api.bookings.getBySlug.useQuery({ slug });

  if (!booking) {
    return null;
  }

  return (
    <>
      <h1 className="text-3xl">{booking.name}</h1>
      <BookingSkatesList bookingId={booking.id} />
    </>
  );
};

export default Booking;
