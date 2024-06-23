import { formatDate } from "@formatting/dates";
import { ArrowRightIcon } from "lucide-react";

interface BookingDatesProps {
  booking: {
    startDate: string | null;
    endDate: string | null;
  };
}

const BookingDates = ({ booking }: BookingDatesProps) => {
  if (!booking.startDate || !booking.endDate) {
    return null;
  }

  if (booking.startDate === booking.endDate) {
    return (
      <div className="flex items-center gap-2 text-foreground/40">
        <p>{formatDate(new Date(booking.startDate), { includeYear: true })}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-foreground/40">
      <p>{formatDate(new Date(booking.startDate), { includeYear: true })}</p>
      <ArrowRightIcon />
      <p>{formatDate(new Date(booking.endDate), { includeYear: true })}</p>
    </div>
  );
};

export default BookingDates;
