"use client";

import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import { BadgeToggle } from "@next/components/ui/badge-toggle";
import BookingCard from "./BookingCard";
import { parseAsStringLiteral, useQueryState } from "nuqs";

type BookingsListProps = {
  className?: string;
};

const listTypes = ["future", "past", "all"] as const;
type ListTypes = (typeof listTypes)[number];

const BookingsList = ({ className }: BookingsListProps) => {
  const [type, setType] = useQueryState(
    "skateListType",
    parseAsStringLiteral<ListTypes>(listTypes).withDefault("future"),
  );
  const { data: bookings } = api.bookings.getAll.useQuery({ type });

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="flex">
        <BadgeToggle
          checked={type === "past"}
          onClick={() => setType(type === "past" ? "future" : "past")}
        >
          Past bookings
        </BadgeToggle>
      </div>
      <div className="flex flex-wrap items-stretch gap-4">
        {bookings?.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default BookingsList;
