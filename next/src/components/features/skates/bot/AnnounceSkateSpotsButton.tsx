"use client";

import { type Skate } from "@db/features/skates/skates.type";
import { Button } from "@next/components/ui/button";
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
    <Button onClick={handleAnnounceSkates}>Announce Skate to Group</Button>
  );
};

export default AnnounceSkateSpotsButton;
