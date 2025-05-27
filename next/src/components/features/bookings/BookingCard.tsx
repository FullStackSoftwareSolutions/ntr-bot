import { type BookingWithoutPlayers } from "@db/features/bookings/bookings.type";
import { formatDate } from "@formatting/dates";
import { Button } from "@next/components/ui/button";
import { Card, CardHeader, CardTitle } from "@next/components/ui/card";
import { cn } from "@next/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import BookingSkateCount from "./BookingSkateCount";
import BookingDates from "./BookingDates";

type BookingCardProps = {
  className?: string;
  booking: BookingWithoutPlayers;
};

const BookingCard = ({ className, booking }: BookingCardProps) => {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "border h-auto rounded-lg bg-secondary/40 p-0.5 text-start hover:bg-secondary",
        className,
      )}
    >
      <Link href={`/booking/${encodeURIComponent(booking.slug!)}`}>
        <Card className="w-full overflow-hidden hover:bg-card/90 sm:w-64">
          <CardHeader className="items-start">
            <CardTitle className="flex flex-wrap items-start gap-2 whitespace-pre-wrap">
              {booking.name}
            </CardTitle>
            <BookingDates booking={booking} />
            <BookingSkateCount booking={booking} />
          </CardHeader>
        </Card>
      </Link>
    </Button>
  );
};

export default BookingCard;
