"use client";

import { type Player } from "@db/features/players/players.type";
import { type WhatsAppGroup } from "@db/features/whatsapp/whatsapp.type";
import { CommandPopoverVirtualized } from "@next/components/ui/command-popover-virtualized";
import { api } from "@next/trpc/react";

type WhatsAppGroupSelectProps = {
  className?: string;
  value: string | null;
  onChange: (playerId: number | null) => void;
};

const WhatsAppGroupSelect = ({
  className,
  value,
  onChange,
}: WhatsAppGroupSelectProps) => {
  const { data: groups, isLoading } = api.whatsapp.getGroups.useQuery();

  const selectedGroup = groups?.find(({ id }) => id === value);

  return (
    <CommandPopoverVirtualized<WhatsAppGroup>
      className={className}
      options={groups ?? []}
      isLoading={isLoading}
      getOptionLabel={(group) => group?.subject}
      value={selectedGroup ?? null}
      onValueChange={(val) => {
        onChange((val as Player | null)?.id ?? null);
      }}
    />
  );
};

export default WhatsAppGroupSelect;
