import { getBookingNotifyJid } from "@whatsapp/features/bookings/bookings.model";
import { sendMessage } from "@whatsapp/integrations/whatsapp/whatsapp.service";
import { getSkateById } from "@db/features/skates/skates.db";
import { TRPCError } from "@trpc/server";
import { getSkateMessage } from "@whatsapp/features/skates/skates.model";

export const announceSkateSpotsHandler = async ({
  skateId,
}: {
  skateId: number;
}) => {
  const skate = await getSkateById(skateId);
  if (!skate) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Skate not found",
    });
  }
  // await sendMessage(getBookingNotifyJid(skate.booking, message), {
  //   text: getSkateMessage(skate),
  // });

  const jid = getBookingNotifyJid(skate.booking);
  if (!jid) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Booking announce group not found",
    });
  }

  await sendMessage(jid, {
    text: getSkateMessage(skate),
  });
};
