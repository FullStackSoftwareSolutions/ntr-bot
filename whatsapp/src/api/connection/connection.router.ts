import { publicProcedure, router } from "@whatsapp/trpc/server";
import { getConnectionStatusHandler } from "./connection.controller";

export const connectionRouter = router({
  getStatus: publicProcedure.query(() => getConnectionStatusHandler()),
});
