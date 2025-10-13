import type { Booking } from "@db/features/bookings/bookings.type";
import type { Player } from "@db/features/players/players.type";
import type { Skate } from "@db/features/skates/skates.type";
import { formatDate } from "@formatting/dates";
import ButtonConfirm from "@next/components/ui/button-confirm";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@next/components/ui/card";
import { CopyButton } from "@next/components/ui/shadcn-io/copy-button";
import { api } from "@next/trpc/react";
import { toast } from "sonner";

interface BookingPaymentRefundsProps {
  booking: Booking;
}

const BookingPaymentRefunds = ({ booking }: BookingPaymentRefundsProps) => {
  const { data } = api.bookings.getSpotsNeedRefund.useQuery({
    bookingId: booking.id,
  });

  if (!data || data.length === 0) {
    return <p>No refunds needed.</p>;
  }

  console.log(data);

  return data.map((player) => (
    <PlayerRefundItem
      key={player.id}
      booking={booking}
      player={player}
      skates={player.skates}
    />
  ));
};

type PlayerRefundItemProps = {
  booking: Booking;
  player: Player;
  skates: Skate[];
};

const PlayerRefundItem = ({
  booking,
  player,
  skates,
}: PlayerRefundItemProps) => {
  const utils = api.useUtils();
  const { mutate, isPending } = api.bookings.refundSpotsForPlayer.useMutation({
    onSuccess: () => {
      void utils.bookings.getSpotsNeedRefund.invalidate({
        bookingId: booking.id,
      });
      toast.success("Refund processed successfully");
    },
    onError: () => {
      void utils.bookings.getSpotsNeedRefund.invalidate({
        bookingId: booking.id,
      });
      toast.error("Failed to process refund");
    },
  });

  const handleRefund = () => {
    mutate({ bookingId: booking.id, playerId: player.id });
  };

  if (skates.length === 0) {
    return null;
  }

  const numSkates = skates.length;
  const totalRefund = Number(booking.costPerPlayerPerSkate) * numSkates;
  const message = `${booking.name} - ${skates
    .map((skate) => formatDate(skate.scheduledOn))
    .join(", ")}`;

  return (
    <Card key={player.id}>
      <CardHeader>
        <CardTitle className="flex items-baseline gap-4 text-xl">
          {player.fullName}
          {player.email && (
            <CardDescription className="flex items-center gap-2">
              {player.email}{" "}
              <CopyButton
                variant="outline"
                size="sm"
                content={player.email}
                onCopy={() => toast.success("Email copied to clipboard!")}
              />
            </CardDescription>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h4 className="text-lg">Amount</h4>

        <div className="text-muted-foreground flex items-center gap-2 py-2">
          <p>${totalRefund.toFixed(2)}</p>
          <CopyButton
            variant="outline"
            size="sm"
            content={totalRefund.toFixed(2)}
            onCopy={() => toast.success("Total refund copied to clipboard!")}
          />
        </div>

        <h4 className="mt-2 text-lg">Message</h4>
        <div className="text-muted-foreground flex items-center gap-2 py-2">
          <p>{message}</p>
          <CopyButton
            variant="outline"
            size="sm"
            content={message}
            onCopy={() => toast.success("Message copied to clipboard!")}
          />
        </div>
        <CardAction>
          <ButtonConfirm
            loading={isPending}
            variant="secondary"
            onClick={handleRefund}
          >
            Refunded
          </ButtonConfirm>
        </CardAction>
      </CardContent>
    </Card>
  );
};

export default BookingPaymentRefunds;
