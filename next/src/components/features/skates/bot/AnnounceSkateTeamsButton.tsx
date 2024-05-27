"use client";

import { type Skate } from "@db/features/skates/skates.type";
import { Button } from "@next/components/ui/button";
import { api } from "@next/trpc/react";

type AnnounceSkateTeamsButtonProps = {
  skate: Skate;
};

const AnnounceSkateTeamsButton = ({ skate }: AnnounceSkateTeamsButtonProps) => {
  const mutation = api.skates.announceTeams.useMutation();

  const handleAnnounceTeams = async () => {
    await mutation.mutateAsync({
      skateId: skate.id,
    });
  };
  return <Button onClick={handleAnnounceTeams}>Announce Teams to Group</Button>;
};

export default AnnounceSkateTeamsButton;
