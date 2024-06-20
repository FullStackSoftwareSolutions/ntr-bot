"use client";

import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import { BadgeToggle } from "@next/components/ui/badge-toggle";
import { useState } from "react";
import BookingCard from "./BookingCard";

type BookingsListProps = {
  className?: string;
};

const BookingsList = ({ className }: BookingsListProps) => {
  const [type, setType] = useState<"future" | "past" | "all">("future");
  const { data: bookings } = api.bookings.getAll.useQuery({ type });

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex">
        <BadgeToggle
          checked={type === "past"}
          onClick={() => setType(type === "past" ? "future" : "past")}
        >
          Past bookings
        </BadgeToggle>
      </div>
      <div className="flex flex-wrap gap-2">
        {bookings?.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default BookingsList;
