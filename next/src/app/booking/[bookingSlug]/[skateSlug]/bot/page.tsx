"use client";

import AnnounceSkateSpotsButton from "@next/components/features/skates/bot/AnnounceSkateSpotsButton";
import { api } from "@next/trpc/react";

export default function SkateBotPageTab({
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

  return (
    <div className="flex">
      <AnnounceSkateSpotsButton skate={skate} />
    </div>
  );
}
