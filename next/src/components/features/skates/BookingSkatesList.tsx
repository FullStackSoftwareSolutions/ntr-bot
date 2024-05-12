"use client";

import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import SkateCard from "./SkateCard";

type BookingSkatesListProps = {
  className?: string;
  bookingId: number;
};

const BookingSkatesList = ({
  className,
  bookingId,
}: BookingSkatesListProps) => {
  const { data: skates } = api.skates.getAllFutureForBooking.useQuery({
    bookingId,
  });

  return (
    <div className={cn("flex flex-wrap gap-4", className)}>
      {skates?.map((skate) => <SkateCard key={skate.id} skate={skate} />)}
    </div>
  );
};

export default BookingSkatesList;
