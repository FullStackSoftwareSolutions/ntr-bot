import { sendMessage } from "@whatsapp/integrations/whatsapp/whatsapp.service";
import { formatList } from "../../features/whatsapp/whatsapp.formatting";
import { getAllCommands } from "../commands";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "@whatsapp/features/whatsapp/whatsapp.model";

export const onCommand = (message: WhatsAppMessage) => {
  const reply = formatList(getAllCommands(), {
    header: {
      content: "💻 Commands",
    },
  });

  sendMessage(getSenderFromMessage(message), { text: reply });
};
