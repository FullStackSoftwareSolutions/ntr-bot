import { type Booking } from "@db/features/bookings/bookings.type";
import BookingSpotCard from "./BookingSpotCard";
import BookingAddPlayerButton from "./BookingAddPlayerButton";
import { Card } from "@next/components/ui/card";
import { Badge } from "@next/components/ui/badge";
import {
  getBookingNumPlayersForPosition,
  getPlayersForBookingPosition,
} from "@next/features/bookings/bookings.model";
import { type Positions } from "@db/features/skates/skates.type";

type BookingPositionSpotsProps = {
  booking: Booking;
  position: Positions;
};

const BookingPositionSpots = ({
  booking,
  position,
}: BookingPositionSpotsProps) => {
  const numPlayers = getBookingNumPlayersForPosition(booking, position);
  const players = getPlayersForBookingPosition(booking, position);

  return (
    <div className="my-4 grid grid-cols-2 items-stretch justify-stretch gap-2 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: numPlayers }).map((_, index) => {
        const playerToBooking = players[index] ?? null;

        return (
          <div
            className="flex flex-1"
            key={playerToBooking?.id ?? `open-${index}`}
          >
            {!!playerToBooking && (
              <BookingSpotCard
                id={playerToBooking.id}
                className="flex-1"
                position={position}
                player={playerToBooking.player}
                booking={booking}
                addedOn={playerToBooking.addedOn}
                amountPaid={playerToBooking.amountPaid}
              />
            )}
            {!playerToBooking && (
              <Card className="flex flex-1 items-center justify-center p-4 font-semibold tracking-tight">
                <Badge
                  variant="warning"
                  className="flex items-center text-lg opacity-50"
                >
                  Open
                </Badge>
              </Card>
            )}
          </div>
        );
      })}
      <BookingAddPlayerButton booking={booking} position={position} />
    </div>
  );
};

export default BookingPositionSpots;
