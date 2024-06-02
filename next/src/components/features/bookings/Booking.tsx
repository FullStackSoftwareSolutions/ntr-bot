"use client";

import { api } from "@next/trpc/react";
import BookingSkatesList from "../skates/BookingSkatesList";
import { MapPinIcon } from "lucide-react";
import { useState } from "react";
import { BadgeToggle } from "@next/components/ui/badge-toggle";

type BookingProps = {
  slug: string;
};

const Booking = ({ slug }: BookingProps) => {
  const [type, setType] = useState<"future" | "past" | "all">("future");
  const { data: booking } = api.bookings.getBySlug.useQuery({ slug });

  if (!booking) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl">{booking.name}</h1>

        <div className="flex items-center gap-4">
          <h2 className="text-xl text-foreground/40">{booking.announceName}</h2>

          <div className="flex items-center gap-1">
            <MapPinIcon className="text-secondary" />
            <p>{booking.location}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-4">
        <BadgeToggle
          checked={type === "past"}
          onClick={() => setType(type === "past" ? "future" : "past")}
        >
          Past skates
        </BadgeToggle>
        <BookingSkatesList bookingId={booking.id} type={type} />
      </div>
    </div>
  );
};

export default Booking;
