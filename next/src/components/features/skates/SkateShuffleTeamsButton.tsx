"use client";

import { type Skate } from "@db/features/skates/skates.type";
import { Button } from "@next/components/ui/button";
import { api } from "@next/trpc/react";

type SkateShuffleTeamsButtonProps = {
  className?: string;
  skate: Skate;
};

const SkateShuffleTeamsButton = ({
  className,
  skate,
}: SkateShuffleTeamsButtonProps) => {
  const utils = api.useUtils();
  const mutation = api.skates.shuffleTeams.useMutation({
    onSuccess: () => {
      return utils.skates.getBySlugs.invalidate({
        skateSlug: skate.slug!,
        bookingSlug: skate.booking.slug!,
      });
    },
  });

  const handleShuffleTeams = async () => {
    await mutation.mutateAsync({
      skateId: skate.id,
    });
  };
  return (
    <Button className={className} onClick={handleShuffleTeams}>
      Shuffle Teams
    </Button>
  );
};

export default SkateShuffleTeamsButton;
