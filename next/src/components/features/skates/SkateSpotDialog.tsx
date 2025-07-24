import { type Player } from "@db/features/players/players.type";
import { type Positions, type Skate } from "@db/features/skates/skates.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@next/components/ui/dialog";
import { Button } from "@next/components/ui/button";
import { getPlayerName } from "@next/features/players/players.model";
import { api } from "@next/trpc/react";
import { useState } from "react";
import { cn } from "@next/lib/utils";
import { formatDateTime } from "@formatting/dates";
import { Badge } from "@next/components/ui/badge";
import { Checkbox } from "@next/components/ui/checkbox";
import SkateSpotMoreOptions from "./SkateSpotMoreOptions";

type SkateSpotDialogProps = {
  id: number;
  skate: Skate;
  player: Player;
  addedOn: Date;
  droppedOutOn?: Date | null;
  substitutePlayer?: Player | null;
  subForPlayer?: Player | null;
  waitingForSub?: boolean;
  paid: boolean;
  refunded: boolean;
  position: Positions;
  className?: string;
  children: React.ReactNode;
};

const SkateSpotDialog = ({
  id,
  player,
  skate,
  position,
  children,
  addedOn,
  droppedOutOn,
  subForPlayer,
  substitutePlayer,
  waitingForSub,
  paid,
  refunded,
  className,
}: SkateSpotDialogProps) => {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);

  const dropOutMutation = api.skates.dropOutPlayer.useMutation({
    onSuccess: async () => {
      await utils.skates.getBySlugs.invalidate({
        skateSlug: skate.slug!,
        bookingSlug: skate.booking.slug!,
      });
      setOpen(false);
    },
  });
  const updateMutation = api.skates.updateSpot.useMutation({
    onSuccess: async () => {
      await utils.skates.getBySlugs.invalidate({
        skateSlug: skate.slug!,
        bookingSlug: skate.booking.slug!,
      });
    },
  });

  const handleDropOut = async () => {
    await dropOutMutation.mutateAsync({
      skateId: skate.id,
      playerId: player.id,
      position,
    });
  };
  const handlePaidChecked = async (checked: boolean) => {
    await updateMutation.mutateAsync({
      id,
      paid: checked,
    });
  };
  const handleRefundedChecked = async (checked: boolean) => {
    await updateMutation.mutateAsync({
      id,
      refunded: checked,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex h-auto items-stretch justify-stretch p-0",
            className,
          )}
        >
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">
            {getPlayerName(player)}
            <SkateSpotMoreOptions id={id} skate={skate} />
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap items-start gap-4">
          <Badge>{paid ? "Paid" : "Not Paid"}</Badge>
          {paid && substitutePlayer && (
            <Badge>{refunded ? "Refunded" : "Not Refunded"}</Badge>
          )}
          {subForPlayer && (
            <Badge>{`Sub for ${getPlayerName(subForPlayer)}`}</Badge>
          )}
          {droppedOutOn && (
            <Badge>{`Out @ ${formatDateTime(droppedOutOn)}`}</Badge>
          )}
          {substitutePlayer && (
            <Badge>{`Covered by ${getPlayerName(substitutePlayer)}`}</Badge>
          )}
          {waitingForSub && (
            <Badge>{`Sub   @ ${formatDateTime(addedOn)}`}</Badge>
          )}
        </div>
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="paid"
              checked={paid}
              onCheckedChange={handlePaidChecked}
            />
            <label
              htmlFor="paid"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Paid
            </label>
          </div>
          {paid && substitutePlayer && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="refunded"
                checked={refunded}
                onCheckedChange={handleRefundedChecked}
              />
              <label
                htmlFor="refunded"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Refunded
              </label>
            </div>
          )}

          <Button
            size="sm"
            className={cn("ml-auto", droppedOutOn && "hidden")}
            onClick={handleDropOut}
            variant="destructive"
          >
            Drop Out
          </Button>
          {/* <DialogCancel>Cancel</DialogCancel>
          <DialogAction onClick={handleDropOut} variant="destructive">
            Drop Out
          </DialogAction> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkateSpotDialog;
