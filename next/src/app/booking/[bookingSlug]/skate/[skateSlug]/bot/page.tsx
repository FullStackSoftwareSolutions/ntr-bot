"use client";

import AnnounceSkatePaymentsButton from "@next/components/features/skates/bot/AnnounceSkatePaymentsButton";
import AnnounceSkateSpotsButton from "@next/components/features/skates/bot/AnnounceSkateSpotsButton";
import AnnounceSkateTeamsButton from "@next/components/features/skates/bot/AnnounceSkateTeamsButton";
import { api } from "@next/trpc/react";
import { use } from "react";

export default function SkateBotPageTab({
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

  return (
    <div className="flex flex-col items-start gap-4">
      <AnnounceSkateSpotsButton skate={skate} />
      <AnnounceSkateTeamsButton skate={skate} />
      <AnnounceSkatePaymentsButton skate={skate} />
    </div>
  );
}
