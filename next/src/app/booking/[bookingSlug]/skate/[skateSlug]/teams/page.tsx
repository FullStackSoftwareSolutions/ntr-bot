"use client";

import SkateTeams from "@next/components/features/skates/SkateTeams";
import { api } from "@next/trpc/react";

export default function SkateTeamsPageTab({
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

  return <SkateTeams skate={skate} />;
}
