"use client";

import { getSkateTimeMessage } from "@next/features/skates/skates.model";
import SkateOpenSpots from "./SkateOpenSpots";
import { type Skate } from "@db/features/skates/skates.type";
import PageHeader from "@next/components/layouts/PageHeader";
import { TrophyIcon } from "lucide-react";
import SkateMoreOptions from "./SkateMoreOptions";

type SkateHeaderProps = {
  skate: Skate;
};

const SkateHeader = ({ skate }: SkateHeaderProps) => {
  return (
    <PageHeader>
      <div className="flex flex-wrap items-center gap-8">
        <TrophyIcon size={32} />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl">{getSkateTimeMessage(skate)}</h1>
            <SkateMoreOptions skate={skate} />
          </div>
          <p className="text-lg text-foreground/40">{skate.booking.name}</p>
        </div>

        <SkateOpenSpots skate={skate} />
      </div>
    </PageHeader>
  );
};

export default SkateHeader;
