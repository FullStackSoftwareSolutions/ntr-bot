"use client";

import { api } from "@next/trpc/react";
import { MapPinIcon } from "lucide-react";
import SkateCard from "./SkateCard";
import { formatDateRelative } from "@formatting/dates/calendar";
import { getSkateTimeMessage } from "@next/features/skates/skates.model";
import SkateOpenSpots from "./SkateOpenSpots";
import SkateFilledSpots from "./SkateFilledSpots";

type SkateProps = {
  bookingSlug: string;
  skateSlug: string;
};

const Skate = ({ bookingSlug, skateSlug }: SkateProps) => {
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
        <p className="text-lg text-muted">{skate.booking.name}</p>
      </div>

      <SkateOpenSpots skate={skate} />
      <SkateFilledSpots skate={skate} />
    </div>
  );
};

export default Skate;
