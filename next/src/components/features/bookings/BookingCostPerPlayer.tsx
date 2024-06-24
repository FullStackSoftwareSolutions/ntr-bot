import { type Booking } from "@db/features/bookings/bookings.type";
import { formatCurrency } from "@formatting/currency";
import { getCostPerPlayerForBooking } from "@next/features/bookings/bookings.model";
import { cn } from "@next/lib/utils";

interface BookingCostPerPlayerProps {
  className?: string;
  booking: Booking;
}

const BookingCostPerPlayer = ({
  booking,
  className,
}: BookingCostPerPlayerProps) => {
  const costPerPlayer =
    booking.costPerPlayer ?? getCostPerPlayerForBooking(booking);

  return (
    <p className={cn("text-foreground/40", className)}>
      {formatCurrency(Number(costPerPlayer))} per player
    </p>
  );
};

export default BookingCostPerPlayer;
