import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./router";
//     👆 **type-only** import

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.WHATSAPP_TRPC_URL ?? "http://localhost:3333",
    }),
  ],
});
