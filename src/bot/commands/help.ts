import { sendMessage } from "~/integrations/whatsapp/whatsapp.service";
import { formatList } from "../../features/whatsapp/whatsapp.formatting";
import { getAllCommands } from "../commands";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";

export const execute = (message: WhatsAppMessage) => {
  const reply = formatList(getAllCommands(), {
    header: {
      content: "💻 Commands",
    },
  });

  sendMessage(getSenderFromMessage(message), { text: reply });
};
