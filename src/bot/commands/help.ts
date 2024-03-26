import { formatTable } from "../../features/whatsapp/whatsapp.model";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import { getAllCommands, getCommandDescription } from "../commands";

export const execute = (senderJid: string) => {
  const message = formatTable(
    getAllCommands().map((command) => ({
      Command: command,
      Description: getCommandDescription(command),
    })),
    {
      header: {
        content: "💻 Commands",
        alignment: "center",
      },
    }
  );

  sendMessage(senderJid, message);
};
