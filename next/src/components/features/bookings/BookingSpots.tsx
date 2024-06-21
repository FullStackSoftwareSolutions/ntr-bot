import { type Booking } from "@db/features/bookings/bookings.type";
import BookingPositionSpots from "./BookingPositionSpots";
import { Positions } from "@db/features/skates/skates.type";

type BookingSpotsProps = {
  booking: Booking;
};

const BookingSpots = ({ booking }: BookingSpotsProps) => {
  return (
    <div className="flex flex-col">
      <h3 className="self-start text-2xl">Players</h3>
      <BookingPositionSpots booking={booking} position={Positions.Player} />
      <h3 className="self-start text-2xl">Goalies</h3>
      <BookingPositionSpots booking={booking} position={Positions.Goalie} />
    </div>
  );
};

export default BookingSpots;
