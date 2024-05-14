import { router } from "./server";
import { skatesRouter } from "@whatsapp/api/skates.router";

export const appRouter = router({
  skates: skatesRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
