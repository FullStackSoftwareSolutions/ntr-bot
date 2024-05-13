import BookingsList from "@next/components/features/bookings/BookingsList";

export default function Home() {
  return (
    <div className="container flex flex-1 flex-col items-start gap-6 p-8">
      <BookingsList />
    </div>
  );
}
