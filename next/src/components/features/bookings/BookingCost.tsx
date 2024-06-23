import { type Booking } from "@db/features/bookings/bookings.type";
import { formatCurrency } from "@formatting/currency";
import { formatDate } from "@formatting/dates";
import { getPlayersAmountPaidForBooking } from "@next/features/bookings/bookings.model";
import { cn } from "@next/lib/utils";
import BookingCostPerPlayer from "./BookingCostPerPlayer";

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
    <div className={cn("flex flex-col items-end gap-2", className)}>
      <div className="flex items-center gap-2 text-foreground/40">
        <p>{formatCurrency(playersPaid)}</p>/
        <p>{formatCurrency(Number(booking.cost))}</p>
      </div>
      <BookingCostPerPlayer booking={booking} />
    </div>
  );
};

export default BookingCost;
