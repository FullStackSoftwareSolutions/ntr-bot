import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  getWhatsAppChatsHandler,
  getWhatsappConnectionStatusHandler,
  getWhatsAppGroupsHandler,
  resetWhatsAppConnectionHandler,
} from "./whatsapp.controller";

export const whatsappRouter = createTRPCRouter({
  getConnection: protectedProcedure.query(() =>
    getWhatsappConnectionStatusHandler(),
  ),
  reset: protectedProcedure.mutation(() => resetWhatsAppConnectionHandler()),
  getGroups: protectedProcedure.query(() => getWhatsAppGroupsHandler()),
  getChats: protectedProcedure.query(() => getWhatsAppChatsHandler()),
});
