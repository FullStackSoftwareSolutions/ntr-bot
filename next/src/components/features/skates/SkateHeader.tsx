"use client";

import { api } from "@next/trpc/react";
import { getSkateTimeMessage } from "@next/features/skates/skates.model";
import SkateOpenSpots from "./SkateOpenSpots";

type SkateHeaderProps = {
  bookingSlug: string;
  skateSlug: string;
  children: React.ReactNode;
};

const SkateHeader = ({
  bookingSlug,
  skateSlug,
  children,
}: SkateHeaderProps) => {
  const { data: skate } = api.skates.getBySlugs.useQuery({
    bookingSlug,
    skateSlug,
  });

  if (!skate) {
    return null;
  }

  return (
    <div className="flex flex-col items-start gap-8">
      <div>
        <h1 className="text-3xl">{getSkateTimeMessage(skate)}</h1>
        <p className="text-lg text-foreground/40">{skate.booking.name}</p>
      </div>

      <SkateOpenSpots skate={skate} />
      {children}
    </div>
  );
};

export default SkateHeader;
