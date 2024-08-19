"use client";

import AnnounceSkatePaymentsButton from "@next/components/features/skates/bot/AnnounceSkatePaymentsButton";
import AnnounceSkateSpotsButton from "@next/components/features/skates/bot/AnnounceSkateSpotsButton";
import AnnounceSkateTeamsButton from "@next/components/features/skates/bot/AnnounceSkateTeamsButton";
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
    <div className="flex flex-col items-start gap-4">
      <AnnounceSkateSpotsButton skate={skate} />
      <AnnounceSkateTeamsButton skate={skate} />
      <AnnounceSkatePaymentsButton skate={skate} />
    </div>
  );
}
