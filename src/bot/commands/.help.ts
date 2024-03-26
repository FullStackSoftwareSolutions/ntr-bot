import { stringJoin } from "../../utils";
import { sendMessage } from "../../whatsapp/whatsapp.service";
import { Command, getAllCommands, getCommandDescription } from "../commands";

export default function command(senderJid: string) {
  const messsage = stringJoin(
    "💻 Commands",
    "───────────",
    ...getAllCommands().map(
      (command) => `- ${command}: ${getCommandDescription(command)}`
    )
  );

  sendMessage(senderJid, messsage);
}
