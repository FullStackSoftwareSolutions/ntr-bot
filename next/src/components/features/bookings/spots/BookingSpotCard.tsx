"use client";

import { type Player } from "@db/features/players/players.type";
import { Badge } from "@next/components/ui/badge";
import { Card } from "@next/components/ui/card";
import BookingSpotDialog from "./BookingSpotDialog";
import { type Booking } from "@db/features/bookings/bookings.type";
import { DollarSignIcon } from "lucide-react";
import { type Positions } from "@db/features/skates/skates.type";
import PlayerSpotCard from "../../players/PlayerSpotCard";
import { formatCurrency } from "@formatting/currency";

type BookingSpotCardProps = {
  id: number;
  position: Positions;
  player: Player;
  booking: Booking;
  addedOn: Date;
  amountPaid: string | null;
  className?: string;
};

const BookingSpotCard = (props: BookingSpotCardProps) => {
  const { player, amountPaid } = props;

  return (
    <BookingSpotDialog {...props}>
      <Card className="flex flex-1 flex-col">
        <PlayerSpotCard player={player} />
        <div className="flex flex-wrap items-start gap-1 p-2 pt-0">
          {amountPaid && (
            <Badge variant="secondary" className="flex gap-1 ps-1">
              Paid
              <DollarSignIcon size={18} />
              {formatCurrency(Number(amountPaid))}
            </Badge>
          )}
        </div>
      </Card>
    </BookingSpotDialog>
  );
};

export default BookingSpotCard;
