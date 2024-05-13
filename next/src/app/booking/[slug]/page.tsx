import Booking from "@next/components/features/bookings/Booking";

export default function BookingPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container flex flex-1 flex-col p-8">
      <Booking slug={params.slug} />
    </div>
  );
}
