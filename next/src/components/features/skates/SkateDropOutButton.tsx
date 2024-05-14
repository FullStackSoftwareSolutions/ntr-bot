import { type Player } from "@db/features/players/players.type";
import { type Skate } from "@db/features/skates/skates.type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@next/components/ui/alert-dialog";
import { Button } from "@next/components/ui/button";
import { getPlayerName } from "@next/features/players/players.model";
import { type Positions } from "@next/features/skates/skates.model";
import { api } from "@next/trpc/react";

type SkateDropOutButtonProps = {
  className?: string;
  skate: Skate;
  player: Player;
  position: Positions;
};

const SkateDropOutButton = ({
  className,
  player,
  skate,
  position,
}: SkateDropOutButtonProps) => {
  const utils = api.useUtils();
  const mutation = api.skates.dropOutPlayer.useMutation({
    onSuccess: () => {
      return utils.skates.getBySlugs.invalidate({
        skateSlug: skate.slug!,
        bookingSlug: skate.booking.slug!,
      });
    },
  });

  const handleDropOut = async () => {
    await mutation.mutateAsync({
      skateId: skate.id,
      playerId: player.id,
      position,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={className} variant="destructive">
          Out
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <p>{getPlayerName(player)} will be dropped from the skate.</p>
            <p>A new sub will be requested to fill the spot.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDropOut} variant="destructive">
            Drop Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SkateDropOutButton;
