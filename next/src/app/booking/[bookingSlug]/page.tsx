import Booking from "@next/components/features/bookings/Booking";

export default function BookingPage({
  params,
}: {
  params: { bookingSlug: string };
}) {
  return (
    <div className="container flex flex-1 flex-col p-8">
      <Booking slug={params.bookingSlug} />
    </div>
  );
}
