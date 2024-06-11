import "dotenv/config";
import { migrate } from "@db/db/migrate";

await migrate();
