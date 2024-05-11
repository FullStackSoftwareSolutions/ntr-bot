import path from "path";
import { fileURLToPath } from "url";

const srcPath = path.dirname(fileURLToPath(import.meta.url));
export const commandsPath = path.resolve(path.join(srcPath, "./bot/commands"));
