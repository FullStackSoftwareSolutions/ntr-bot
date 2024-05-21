import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import { getWhatsappConnectionStatusHandler } from "./whatsapp.controller";

export const whatsappRouter = createTRPCRouter({
  getConnection: protectedProcedure.query(() =>
    getWhatsappConnectionStatusHandler(),
  ),
});
