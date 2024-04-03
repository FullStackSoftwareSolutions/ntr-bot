import path from "path";
import { readdir } from "fs/promises";
import { commandsPath } from "~/paths";

export enum Command {
  Help = "help",
  Seed = "seed",
  Players = "players",
  PlayersAdd = "players.add",
  PlayersEdit = "players.edit",
  Bookings = "bookings",
  BookingsAdd = "bookings.add",
  BookingsList = "bookings.list",
}

export const commandDescriptions = {
  [Command.Help]: "List all commands",
  [Command.Players]: "List all players",
};

const commands = new Map<string, any>();

export const getCommand = (command: string | null | undefined) => {
  if (!command) return null;

  return commands.get(command);
};

export const getAllCommands = () =>
  [...commands.keys()].map((command) => ({
    command: command,
    description: getCommandDescription(command),
  }));

export const loadCommands = async () => {
  const files = await readdir(commandsPath);

  for (const commandFile of files) {
    const command = path.basename(commandFile, ".ts");
    const filePath = `./${path.join("commands", command)}`;

    const commandImport = await import(filePath);

    if ("execute" in commandImport || "onCommand" in commandImport) {
      commands.set(command, commandImport);
    } else {
      console.warn(
        `[WARNING] The command at ${filePath} is missing the required "execute" or "onCommand" property.`
      );
    }
  }
};

export const getCommandDescription = (command: string) =>
  commandDescriptions[command as keyof typeof commandDescriptions];
