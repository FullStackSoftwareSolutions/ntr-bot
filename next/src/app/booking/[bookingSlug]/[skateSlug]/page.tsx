import Skate from "@next/components/features/skates/Skate";

export default function BookingSkatePage({
  params,
}: {
  params: { bookingSlug: string; skateSlug: string };
}) {
  return (
    <div className="container flex flex-1 flex-col p-8">
      <Skate bookingSlug={params.bookingSlug} skateSlug={params.skateSlug} />
    </div>
  );
}
