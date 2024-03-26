export enum Command {
  Help = "help",
  Seed = "seed",
  Players = "players",
}

export const commandDescriptions = {
  [Command.Help]: "List all commands",
  [Command.Players]: "List all players",
};

export const getAllCommands = () => Object.values(Command);
export const getCommandDescription = (command: Command) =>
  commandDescriptions[command as keyof typeof commandDescriptions];
