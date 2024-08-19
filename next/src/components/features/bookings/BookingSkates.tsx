"use client";

import { api } from "@next/trpc/react";
import BookingSkatesList from "../skates/BookingSkatesList";
import { BadgeToggle } from "@next/components/ui/badge-toggle";
import { doesBookingHavePastSkates } from "@next/features/bookings/bookings.model";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type BookingSkatesProps = {
  slug: string;
};

const BookingSkates = ({ slug }: BookingSkatesProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const view = searchParams.get("view");
  const type = view === "past" ? "past" : "future";

  const { data: booking } = api.bookings.getBySlug.useQuery({ slug });

  if (!booking) {
    return null;
  }

  const hasPastSkates = doesBookingHavePastSkates(booking);

  return (
    <div className="flex flex-col items-start gap-4">
      {hasPastSkates && (
        <BadgeToggle
          checked={view === "past"}
          onClick={() => {
            const params = new URLSearchParams(searchParams?.toString());

            if (view === "past") {
              params.delete("view");
            } else {
              params.set("view", "past");
            }

            router.push(`${pathname}?${params.toString()}`);
          }}
        >
          Past skates
        </BadgeToggle>
      )}
      <BookingSkatesList bookingId={booking.id} type={type} />
    </div>
  );
};

export default BookingSkates;
