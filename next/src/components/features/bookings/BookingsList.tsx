"use client";

import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import BookingSkatesList from "../skates/BookingSkatesList";
import { Button } from "@next/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { BadgeToggle } from "@next/components/ui/badge-toggle";
import { useState } from "react";

type BookingsListProps = {
  className?: string;
};

const BookingsList = ({ className }: BookingsListProps) => {
  const [type, setType] = useState<"future" | "past" | "all">("future");
  const { data: bookings } = api.bookings.getAll.useQuery({ type });

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="flex">
        <BadgeToggle
          checked={type === "past"}
          onClick={() => setType(type === "past" ? "future" : "past")}
        >
          Past skates
        </BadgeToggle>
      </div>
      {bookings?.map((booking) => (
        <div key={booking.id} className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-2xl">
            {booking.name}
            <Button asChild variant="ghost">
              <Link href={`/booking/${booking.slug}`}>
                <ArrowRightIcon className="s-4" />
              </Link>
            </Button>
          </h2>

          <BookingSkatesList bookingId={booking.id} type={type} />
        </div>
      ))}
    </div>
  );
};

export default BookingsList;
