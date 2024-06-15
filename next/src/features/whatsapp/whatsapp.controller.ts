import { trpc } from "@whatsapp/trpc/client";

export const getWhatsappConnectionStatusHandler = async () => {
  let status = null;
  try {
    status = await trpc.connection.getStatus.query();
  } catch (error) {
    throw new Error("WhatsApp unavailable");
  }

  return status;
};

export const resetWhatsAppConnectionHandler = async () => {
  return trpc.connection.reset.mutate();
};

export const getWhatsAppGroupsHandler = async () => {
  return trpc.connection.getGroups.query();
};

export const getWhatsAppChatsHandler = async () => {
  return trpc.connection.getChats.query();
};
