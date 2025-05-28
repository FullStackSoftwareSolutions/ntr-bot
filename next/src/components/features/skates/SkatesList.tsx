"use client";

import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import SkateCard from "./SkateCard";
import { BadgeToggle } from "@next/components/ui/badge-toggle";
import { parseAsStringLiteral, useQueryState } from "nuqs";

type SkatesListProps = {
  className?: string;
};

const listTypes = ["future", "past", "all"] as const;
type ListTypes = (typeof listTypes)[number];

const SkatesList = ({ className }: SkatesListProps) => {
  const [type, setType] = useQueryState(
    "skateListType",
    parseAsStringLiteral<ListTypes>(listTypes).withDefault("future"),
  );
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
      <div className="flex flex-wrap items-stretch gap-4">
        {skates?.map((skate) => <SkateCard key={skate.id} skate={skate} />)}
      </div>
    </div>
  );
};

export default SkatesList;
