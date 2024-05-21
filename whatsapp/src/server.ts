import "dotenv/config";
import { initializeBot } from "./bot";
import { connectToWhatsapp } from "./features/whatsapp/whatsapp.controller";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./trpc/router";

await connectToWhatsapp();
await initializeBot();

const server = createHTTPServer({
  router: appRouter,
});

server.listen(process.env.WHATSAPP_TRPC_PORT ?? 3333);
