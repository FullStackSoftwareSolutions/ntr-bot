import { Message, onMessage, sendMessage } from "../whatsapp/whatsapp.service";
import { Command, getAllCommands } from "./commands";
import help from "./commands/.help";
import skaters from "./commands/.skaters";

export const initializeBot = () => {
  onMessage(handleMessage);
};

const handleMessage = ({ senderJid, message }: Message) => {
  console.log("received message", { senderJid, message });

  switch (message) {
    case Command.Help:
      help(senderJid);
      break;
    case Command.Skaters:
      skaters(senderJid);
      break;
    default:
      sendMessage(senderJid, "Command not found");
      break;
  }
};
