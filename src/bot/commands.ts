export enum Command {
  Help = ".help",
  Skaters = ".skaters",
}

export const commandDescriptions = {
  [Command.Help]: "List all commands",
  [Command.Skaters]: "List all skaters",
};

export const getAllCommands = () => Object.values(Command);
export const getCommandDescription = (command: Command) =>
  commandDescriptions[command];
