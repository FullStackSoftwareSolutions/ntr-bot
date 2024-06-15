"use client";

import { Card } from "@next/components/ui/card";
import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";

type WhatsAppGroupsProps = {
  className?: string;
};

const WhatsAppGroups = ({ className }: WhatsAppGroupsProps) => {
  const { data: groups } = api.whatsapp.getGroups.useQuery();

  if (groups == null) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-start gap-2", className)}>
      {groups.map((group) => (
        <Card className="p-2 px-4" key={group.id}>
          <h2 className="flex items-center gap-2">
            <div>{group.subject}</div>
            <div className="text-sm text-foreground/60">({group.id})</div>
          </h2>
        </Card>
      ))}
    </div>
  );
};

export default WhatsAppGroups;
