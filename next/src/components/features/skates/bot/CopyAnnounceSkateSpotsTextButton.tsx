"use client";

import { type Skate } from "@db/features/skates/skates.type";
import { Button } from "@next/components/ui/button";
import { api } from "@next/trpc/react";
import { Copy } from "lucide-react";

type CopyAnnounceSkateSpotsTextButtonProps = {
  skate: Skate;
};

const CopyAnnounceSkateSpotsTextButton = ({
  skate,
}: CopyAnnounceSkateSpotsTextButtonProps) => {
  const { data } = api.skates.getAnnounceSpotsText.useQuery({
    skateId: skate.id,
  });

  if (!data) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      onClick={() => {
        navigator.clipboard.writeText(data);
      }}
    >
      <Copy />
    </Button>
  );
};

export default CopyAnnounceSkateSpotsTextButton;
