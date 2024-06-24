import { type Booking } from "@db/features/bookings/bookings.type";
import { formatCurrency } from "@formatting/currency";
import { formatDate } from "@formatting/dates";
import {
  getPlayersAmountPaidForBooking,
  getRemainingCostForBooking,
} from "@next/features/bookings/bookings.model";
import { cn } from "@next/lib/utils";
import BookingCostPerPlayer from "./BookingCostPerPlayer";
import { Badge } from "@next/components/ui/badge";

interface BookingCostProps {
  className?: string;
  booking: Booking;
}

const BookingCost = ({ booking, className }: BookingCostProps) => {
  if (!booking.cost) {
    return null;
  }

  const playersPaid = getPlayersAmountPaidForBooking(booking) ?? 0;

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      <BookingCostRemaining booking={booking} />
      <div className="flex items-center gap-2 text-foreground/40">
        <p>{formatCurrency(playersPaid)}</p>/
        <p>{formatCurrency(Number(booking.cost))}</p>
      </div>
    </div>
  );
};

export const BookingCostRemaining = ({ booking }: BookingCostProps) => {
  const amountRemaining = getRemainingCostForBooking(booking);

  if (amountRemaining > 0) {
    return (
      <Badge
        variant="destructive"
        className="flex flex-col items-end p-1 px-4 text-xl text-foreground"
      >
        <p className="leading-6">{formatCurrency(amountRemaining)}</p>
        <p className="text-sm leading-3">remaining</p>
      </Badge>
    );
  }

  return <Badge className="text-xl text-foreground">Cost covered</Badge>;
};

export default BookingCost;
