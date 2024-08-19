import { type Booking } from "@db/features/bookings/bookings.type";
import { formatCurrency } from "@formatting/currency";
import {
  getCostPerPlayerForBooking,
  getCostPerSkatePerPlayerForBooking,
} from "@next/features/bookings/bookings.model";
import { cn } from "@next/lib/utils";

interface BookingCostPerPlayerProps {
  className?: string;
  booking: Booking;
}

const BookingCostPerPlayer = ({
  booking,
  className,
}: BookingCostPerPlayerProps) => {
  const computedCostPerPlayer = getCostPerPlayerForBooking(booking);
  const computedCostPerPlayerPerSkate =
    getCostPerSkatePerPlayerForBooking(booking);

  return (
    <div
      className={cn("flex items-center gap-1 text-foreground/40", className)}
    >
      <p>{`${formatCurrency(Number(booking.costPerPlayer))} per player (${formatCurrency(computedCostPerPlayer)})`}</p>
      <p className="mx-2">→</p>
      <p>{`${formatCurrency(Number(booking.costPerPlayerPerSkate))} per skate (${formatCurrency(computedCostPerPlayerPerSkate)})`}</p>
    </div>
  );
};

export default BookingCostPerPlayer;
