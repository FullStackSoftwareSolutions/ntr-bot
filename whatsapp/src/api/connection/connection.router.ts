import { publicProcedure, router } from "@whatsapp/trpc/server";
import {
  getChatsHandler,
  getConnectionStatusHandler,
  getGroupsHandler,
  resetConnectionHandler,
} from "./connection.controller";

export const connectionRouter = router({
  getStatus: publicProcedure.query(() => getConnectionStatusHandler()),
  reset: publicProcedure.mutation(() => resetConnectionHandler()),
  getGroups: publicProcedure.query(() => getGroupsHandler()),
  getChats: publicProcedure.query(() => getChatsHandler()),
});
