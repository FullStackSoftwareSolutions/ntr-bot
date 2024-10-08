import { publicProcedure, router } from "@whatsapp/trpc/server";
import { z } from "zod";
import {
  announceSkatePaymentsHandler,
  announceSkateSpotsHandler,
  announceSkateTeamsHandler,
} from "./skates.controller";

export const skatesRouter = router({
  announceSpots: publicProcedure
    .input(z.object({ skateId: z.number() }))
    .mutation(({ input: { skateId } }) =>
      announceSkateSpotsHandler({ skateId })
    ),
  announceTeams: publicProcedure
    .input(z.object({ skateId: z.number() }))
    .mutation(({ input: { skateId } }) =>
      announceSkateTeamsHandler({ skateId })
    ),
  announcePayments: publicProcedure
    .input(z.object({ skateId: z.number() }))
    .mutation(({ input: { skateId } }) =>
      announceSkatePaymentsHandler({ skateId })
    ),
});
