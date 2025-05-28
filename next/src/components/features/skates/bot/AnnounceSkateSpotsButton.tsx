"use client";

import { type Skate } from "@db/features/skates/skates.type";
import { Button } from "@next/components/ui/button";
import WhatsAppIcon from "@next/svg/WhatsAppIcon";
import { api } from "@next/trpc/react";

type AnnounceSkateSpotsButtonProps = {
  skate: Skate;
};

const AnnounceSkateSpotsButton = ({ skate }: AnnounceSkateSpotsButtonProps) => {
  const mutation = api.skates.announceSpots.useMutation();

  const handleAnnounceSkates = async () => {
    await mutation.mutateAsync({
      skateId: skate.id,
    });
  };
  return (
    <Button onClick={handleAnnounceSkates}>
      <WhatsAppIcon />
    </Button>
  );
};

export default AnnounceSkateSpotsButton;
