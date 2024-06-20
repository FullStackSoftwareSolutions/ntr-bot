"use client";

import { api } from "@next/trpc/react";
import BookingSkatesList from "../skates/BookingSkatesList";
import { useState } from "react";
import { BadgeToggle } from "@next/components/ui/badge-toggle";

type BookingSkatesProps = {
  slug: string;
};

const BookingSkates = ({ slug }: BookingSkatesProps) => {
  const [type, setType] = useState<"future" | "past" | "all">("future");
  const { data: booking } = api.bookings.getBySlug.useQuery({ slug });

  if (!booking) {
    return null;
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <BadgeToggle
        checked={type === "past"}
        onClick={() => setType(type === "past" ? "future" : "past")}
      >
        Past skates
      </BadgeToggle>
      <BookingSkatesList bookingId={booking.id} type={type} />
    </div>
  );
};

export default BookingSkates;
