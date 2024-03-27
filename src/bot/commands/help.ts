import { sendMessage } from "~/integrations/whatsapp/whatsapp.service";
import { formatTable } from "../../features/whatsapp/whatsapp.formatting";
import { commands, getCommandDescription } from "../commands";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";

export const execute = (message: WhatsAppMessage) => {
  const reply = formatTable(
    [...commands.keys()].map((command) => ({
      Command: command,
      Description: getCommandDescription(command),
    })),
    {
      hideKeys: true,
      header: {
        content: "💻 Commands",
        alignment: "center",
      },
    }
  );

  sendMessage(getSenderFromMessage(message), { text: reply });
};
