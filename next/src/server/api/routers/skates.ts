import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const skatesRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});
