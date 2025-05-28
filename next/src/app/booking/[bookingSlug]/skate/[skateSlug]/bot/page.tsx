"use client";

import AnnounceSkatePaymentsButton from "@next/components/features/skates/bot/AnnounceSkatePaymentsButton";
import AnnounceSkateSpotsButton from "@next/components/features/skates/bot/AnnounceSkateSpotsButton";
import AnnounceSkateTeamsButton from "@next/components/features/skates/bot/AnnounceSkateTeamsButton";
import CopyAnnounceSkatePaymentsTextButton from "@next/components/features/skates/bot/CopyAnnounceSkatePaymentsTextButton";
import CopyAnnounceSkateSpotsTextButton from "@next/components/features/skates/bot/CopyAnnounceSkateSpotsTextButton";
import CopyAnnounceSkateTeamsTextButton from "@next/components/features/skates/bot/CopyAnnounceSkateTeamsTextButton";
import { Card, CardAction, CardHeader } from "@next/components/ui/card";
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
      <Card className="flex min-w-56 flex-row items-center justify-between gap-4 p-4">
        Spots
        <div className="flex items-center gap-2">
          <AnnounceSkateSpotsButton skate={skate} />
          <CopyAnnounceSkateSpotsTextButton skate={skate} />
        </div>
      </Card>
      <Card className="flex min-w-56 flex-row items-center justify-between gap-4 p-4">
        Teams
        <div className="flex items-center gap-2">
          <AnnounceSkateTeamsButton skate={skate} />
          <CopyAnnounceSkateTeamsTextButton skate={skate} />
        </div>
      </Card>
      <Card className="flex min-w-56 flex-row items-center justify-between gap-4 p-4">
        Payments
        <div className="flex items-center gap-2">
          <AnnounceSkatePaymentsButton skate={skate} />
          <CopyAnnounceSkatePaymentsTextButton skate={skate} />
        </div>
      </Card>
    </div>
  );
}
