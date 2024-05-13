"use client";

import { api } from "@next/trpc/react";
import BookingSkatesList from "../skates/BookingSkatesList";
import { MapPinIcon } from "lucide-react";

type BookingProps = {
  slug: string;
};

const Booking = ({ slug }: BookingProps) => {
  const { data: booking } = api.bookings.getBySlug.useQuery({ slug });

  if (!booking) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl">{booking.name}</h1>

        <div className="flex items-center gap-4">
          <h2 className="text-xl text-muted">{booking.announceName}</h2>

          <div className="flex items-center gap-1">
            <MapPinIcon className="text-secondary" />
            <p>{booking.location}</p>
          </div>
        </div>
      </div>
      <BookingSkatesList bookingId={booking.id} />
    </div>
  );
};

export default Booking;
