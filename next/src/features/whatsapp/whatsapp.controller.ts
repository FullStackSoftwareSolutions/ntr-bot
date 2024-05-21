import { trpc } from "@whatsapp/trpc/client";

export const getWhatsappConnectionStatusHandler = async () => {
  let status = null;
  try {
    status = await trpc.connection.getStatus.query();
  } catch (error) {
    console.error(error);
  }

  return status;
};
