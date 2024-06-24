import { type Player } from "@db/features/players/players.type";
import { type Booking } from "@db/features/bookings/bookings.type";
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
import BookingSpotMoreOptions from "./BookingSpotMoreOptions";
import { type Positions } from "@db/features/skates/skates.type";
import BookingSpotEditForm from "./BookingSpotEditForm";

type BookingSpotDialogProps = {
  id: number;
  booking: Booking;
  player: Player;
  addedOn: Date;
  amountPaid: string | null;
  position: Positions;
  className?: string;
  children: React.ReactNode;
};

const BookingSpotDialog = ({
  id,
  player,
  booking,
  children,
  amountPaid,
  className,
}: BookingSpotDialogProps) => {
  const [open, setOpen] = useState(false);

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
            <BookingSpotMoreOptions id={id} booking={booking} player={player} />
          </DialogTitle>
        </DialogHeader>
        <BookingSpotEditForm
          id={id}
          className="mt-2"
          booking={booking}
          amountPaid={amountPaid}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookingSpotDialog;
