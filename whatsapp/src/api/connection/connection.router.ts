import { publicProcedure, router } from "@whatsapp/trpc/server";
import {
  getConnectionStatusHandler,
  resetConnectionHandler,
} from "./connection.controller";

export const connectionRouter = router({
  getStatus: publicProcedure.query(() => getConnectionStatusHandler()),
  reset: publicProcedure.mutation(() => resetConnectionHandler()),
});
