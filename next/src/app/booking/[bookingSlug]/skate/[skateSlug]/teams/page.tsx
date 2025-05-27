"use client";

import SkateTeams from "@next/components/features/skates/SkateTeams";
import { api } from "@next/trpc/react";
import { use } from "react";

export default function SkateTeamsPageTab({
  params,
}: {
  params: Promise<{ bookingSlug: string; skateSlug: string }>;
}) {
  const { bookingSlug, skateSlug } = use(params);
  const { data: skate } = api.skates.getBySlugs.useQuery({
    bookingSlug,
    skateSlug,
  });

  if (!skate) {
    return null;
  }

  return <SkateTeams skate={skate} />;
}
