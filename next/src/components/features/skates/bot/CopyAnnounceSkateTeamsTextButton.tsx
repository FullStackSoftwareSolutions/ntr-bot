"use client";

import { type Skate } from "@db/features/skates/skates.type";
import { Button } from "@next/components/ui/button";
import { api } from "@next/trpc/react";
import { Copy } from "lucide-react";

type CopyAnnounceSkateTeamsTextButtonProps = {
  skate: Skate;
};

const CopyAnnounceSkateTeamsTextButton = ({
  skate,
}: CopyAnnounceSkateTeamsTextButtonProps) => {
  const { data } = api.skates.getAnnounceTeamsText.useQuery({
    skateId: skate.id,
  });

  if (!data) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      onClick={() => {
        void navigator.clipboard.writeText(data);
      }}
    >
      <Copy />
    </Button>
  );
};

export default CopyAnnounceSkateTeamsTextButton;
