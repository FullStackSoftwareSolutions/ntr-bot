import { sendMessage } from "~/integrations/whatsapp/whatsapp.service";
import {
  formatList,
  formatTable,
} from "../../features/whatsapp/whatsapp.formatting";
import { commands, getCommandDescription } from "../commands";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";

export const execute = (message: WhatsAppMessage) => {
  const reply = formatList(
    [...commands.keys()].map((command) => ({
      command: command,
      description: getCommandDescription(command),
    })),
    {
      header: {
        content: "💻 Commands",
      },
    }
  );

  sendMessage(getSenderFromMessage(message), { text: reply });
};
