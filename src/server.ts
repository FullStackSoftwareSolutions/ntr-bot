import "dotenv/config";
import { initializeBot } from "./bot";
import { connectToWhatsapp } from "./features/whatsapp/whatsapp.controller";

await connectToWhatsapp();
initializeBot();
