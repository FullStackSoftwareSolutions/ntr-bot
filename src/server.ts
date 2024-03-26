import "dotenv/config";
import { connect } from "./whatsapp/whatsapp.service";
import { initializeBot } from "./bot";

await connect();
initializeBot();
