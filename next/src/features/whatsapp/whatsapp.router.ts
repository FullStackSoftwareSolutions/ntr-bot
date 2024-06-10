import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  getWhatsappConnectionStatusHandler,
  resetWhatsAppConnectionHandler,
} from "./whatsapp.controller";

export const whatsappRouter = createTRPCRouter({
  getConnection: protectedProcedure.query(() =>
    getWhatsappConnectionStatusHandler(),
  ),
  reset: protectedProcedure.mutation(() => resetWhatsAppConnectionHandler()),
});
