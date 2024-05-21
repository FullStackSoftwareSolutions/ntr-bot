import { connectionRouter } from "@whatsapp/api/connection/connection.router";
import { router } from "./server";
import { skatesRouter } from "@whatsapp/api/skates/skates.router";

export const appRouter = router({
  connection: connectionRouter,
  skates: skatesRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
