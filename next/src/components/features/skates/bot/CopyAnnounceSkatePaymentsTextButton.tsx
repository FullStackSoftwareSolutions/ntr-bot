"use client";

import { type Skate } from "@db/features/skates/skates.type";
import { Button } from "@next/components/ui/button";
import { api } from "@next/trpc/react";
import { Copy } from "lucide-react";

type CopyAnnounceSkatePaymentsTextButtonProps = {
  skate: Skate;
};

const CopyAnnounceSkatePaymentsTextButton = ({
  skate,
}: CopyAnnounceSkatePaymentsTextButtonProps) => {
  const { data } = api.skates.getAnnouncePaymentsText.useQuery({
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

export default CopyAnnounceSkatePaymentsTextButton;
