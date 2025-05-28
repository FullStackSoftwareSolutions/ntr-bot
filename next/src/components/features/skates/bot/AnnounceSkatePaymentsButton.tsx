"use client";

import { type Skate } from "@db/features/skates/skates.type";
import { Button } from "@next/components/ui/button";
import WhatsAppIcon from "@next/svg/WhatsAppIcon";
import { api } from "@next/trpc/react";

type AnnounceSkatePaymentsButtonProps = {
  skate: Skate;
};

const AnnounceSkatePaymentsButton = ({
  skate,
}: AnnounceSkatePaymentsButtonProps) => {
  const mutation = api.skates.announcePayments.useMutation();

  const handleAnnouncePayments = async () => {
    await mutation.mutateAsync({
      skateId: skate.id,
    });
  };
  return (
    <Button onClick={handleAnnouncePayments}>
      <WhatsAppIcon />
    </Button>
  );
};

export default AnnounceSkatePaymentsButton;
