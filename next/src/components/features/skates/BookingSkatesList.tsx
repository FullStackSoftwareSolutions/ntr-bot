"use client";

import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import SkateCard from "./SkateCard";

type BookingSkatesListProps = {
  className?: string;
  bookingId: number;
  type: "future" | "past" | "all";
};

const BookingSkatesList = ({
  className,
  bookingId,
  type,
}: BookingSkatesListProps) => {
  const { data: skates } = api.skates.getAllForBooking.useQuery({
    bookingId,
    type,
  });

  return (
    <div className={cn("flex flex-wrap items-start gap-4", className)}>
      {skates?.map((skate) => <SkateCard key={skate.id} skate={skate} />)}
    </div>
  );
};

export default BookingSkatesList;
