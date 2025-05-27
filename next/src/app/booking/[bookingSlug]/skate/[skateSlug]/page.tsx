"use client";

import SkateSpots from "@next/components/features/skates/SkateSpots";
import { api } from "@next/trpc/react";
import { use } from "react";

export default function BookingSkatePage({
  params,
}: {
  params: Promise<{ bookingSlug: string; skateSlug: string }>;
}) {
  const { bookingSlug, skateSlug } = use(params);
  const { data: skate } = api.skates.getBySlugs.useQuery({
    bookingSlug: bookingSlug,
    skateSlug: skateSlug,
  });

  if (!skate) {
    return null;
  }

  return <SkateSpots skate={skate} />;
}
