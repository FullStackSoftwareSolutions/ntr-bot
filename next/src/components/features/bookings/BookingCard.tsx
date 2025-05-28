import { type BookingWithoutPlayers } from "@db/features/bookings/bookings.type";
import { Button } from "@next/components/ui/button";
import { Card, CardHeader, CardTitle } from "@next/components/ui/card";
import { cn } from "@next/lib/utils";
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
        "bg-secondary/40 hover:bg-secondary dark:hover:bg-secondary h-auto w-full rounded-lg border p-0.5 text-start sm:w-64",
        className,
      )}
    >
      <Link href={`/booking/${encodeURIComponent(booking.slug!)}`}>
        <Card className="hover:bg-card/90 dark:hover:bg-card/90 h-full w-full overflow-hidden">
          <CardHeader className="items-start">
            <CardTitle className="flex flex-wrap items-start gap-2 text-xl whitespace-pre-wrap">
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
