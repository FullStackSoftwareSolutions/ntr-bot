"use client";

import SkateSpots from "@next/components/features/skates/SkateSpots";
import { api } from "@next/trpc/react";

export default function BookingSkatePage({
  params,
}: {
  params: { bookingSlug: string; skateSlug: string };
}) {
  const { data: skate } = api.skates.getBySlugs.useQuery({
    bookingSlug: params.bookingSlug,
    skateSlug: params.skateSlug,
  });

  if (!skate) {
    return null;
  }

  return <SkateSpots skate={skate} />;
}
