"use client";

import { CalendarClockIcon, MapPinIcon } from "lucide-react";
import PageHeader from "@next/components/layouts/PageHeader";
import BookingDates from "./BookingDates";
import BookingSkateCount from "./BookingSkateCount";
import BookingCost from "./BookingCost";
import { type Booking } from "@db/features/bookings/bookings.type";
import BookingMoreOptions from "./BookingMoreOptions";

type BookingHeaderProps = {
  booking: Booking;
};

const BookingHeader = ({ booking }: BookingHeaderProps) => {
  return (
    <PageHeader>
      <div className="ms-8 flex items-center gap-4">
        <CalendarClockIcon className="text-4xl font-bold" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl">{booking.name}</h1>
            <BookingMoreOptions booking={booking} />
          </div>

          <div className="flex items-center gap-4">
            <BookingDates booking={booking} />
          </div>
          <div className="mt-1 flex items-center gap-1">
            <BookingSkateCount booking={booking} />
            <MapPinIcon className="text-secondary" />
            <p>{booking.location}</p>
          </div>
        </div>
        <BookingCost booking={booking} className="ml-auto" />
      </div>
    </PageHeader>
  );
};

export default BookingHeader;
