"use client";

import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import SkateCard from "./SkateCard";
import { BadgeToggle } from "@next/components/ui/badge-toggle";
import { useState } from "react";

type SkatesListProps = {
  className?: string;
};

const SkatesList = ({ className }: SkatesListProps) => {
  const [type, setType] = useState<"future" | "past" | "all">("future");
  const { data: skates } = api.skates.getAll.useQuery({ type });

  return (
    <div className={cn("flex flex-col items-start gap-4", className)}>
      <div className="flex">
        <BadgeToggle
          checked={type === "past"}
          onClick={() => setType(type === "past" ? "future" : "past")}
        >
          Past skates
        </BadgeToggle>
      </div>
      <div className="flex flex-wrap items-start gap-4">
        {skates?.map((skate) => <SkateCard key={skate.id} skate={skate} />)}
      </div>
    </div>
  );
};

export default SkatesList;
