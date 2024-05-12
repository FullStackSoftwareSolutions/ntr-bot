import BookingsList from "@next/components/features/bookings/BookingsList";

export default function Home() {
  return (
    <div className="container flex flex-1 flex-col items-start gap-6 p-8">
      <h1 className="m-12 text-4xl font-bold">🤖 beep boop</h1>
      <BookingsList />
    </div>
  );
}
