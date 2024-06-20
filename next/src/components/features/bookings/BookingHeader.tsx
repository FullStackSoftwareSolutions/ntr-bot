"use client";

import { api } from "@next/trpc/react";
import { MapPinIcon } from "lucide-react";
import PageHeader from "@next/components/layouts/PageHeader";
import BookingDates from "./BookingDates";
import BookingSkateCount from "./BookingSkateCount";

type BookingHeaderProps = {
  slug: string;
};

const BookingHeader = ({ slug }: BookingHeaderProps) => {
  const { data: booking } = api.bookings.getBySlug.useQuery({ slug });

  if (!booking) {
    return null;
  }

  return (
    <PageHeader>
      <h1 className="text-3xl">{booking.name}</h1>

      <div className="flex items-center gap-4">
        <BookingDates booking={booking} />
        <BookingSkateCount booking={booking} />

        <div className="flex items-center gap-1">
          <MapPinIcon className="text-secondary" />
          <p>{booking.location}</p>
        </div>
      </div>
    </PageHeader>
  );
};

export default BookingHeader;
