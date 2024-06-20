import BookingsList from "@next/components/features/bookings/BookingsList";
import BookingAddDialog from "@next/components/features/bookings/create/BookingAddDialog";
import { CalendarClockIcon } from "lucide-react";

export default function BookingsPage() {
  return (
    <div className="container flex flex-1 flex-col items-start gap-6 p-8">
      <h1 className="m-8 flex items-center gap-4 text-4xl font-bold">
        <CalendarClockIcon /> Bookings
        <div className="flex gap-2">
          <BookingAddDialog />
        </div>
      </h1>
      <BookingsList />
    </div>
  );
}
