import { sendMessage } from "@whatsapp/integrations/whatsapp/whatsapp.service";
import { publicProcedure, router } from "./server";
import { z } from "zod";

export const appRouter = router({
  sendMessage: publicProcedure
    .input(
      z.object({
        toJid: z.string(),
        message: z.string(),
      })
    )
    .mutation(({ input: { toJid, message } }) =>
      sendMessage(toJid, {
        text: message,
      })
    ),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
