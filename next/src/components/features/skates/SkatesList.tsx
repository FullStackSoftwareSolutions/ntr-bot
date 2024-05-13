"use client";

import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import SkateCard from "./SkateCard";

type SkatesListProps = {
  className?: string;
};

const SkatesList = ({ className }: SkatesListProps) => {
  const { data: skates } = api.skates.getFuture.useQuery();

  return (
    <div className={cn("flex flex-wrap items-start gap-4", className)}>
      {skates?.map((skate) => <SkateCard key={skate.id} skate={skate} />)}
    </div>
  );
};

export default SkatesList;
