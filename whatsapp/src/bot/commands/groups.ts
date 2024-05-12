import {
  getAllGroups,
  sendMessage,
} from "@whatsapp/integrations/whatsapp/whatsapp.service";
import { formatList } from "../../features/whatsapp/whatsapp.formatting";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "@whatsapp/features/whatsapp/whatsapp.model";

export const onCommand = async (message: WhatsAppMessage) => {
  const whatsAppGroups = await getAllGroups();

  const reply = formatList(
    whatsAppGroups.map(
      (group) => ({
        id: group.id,
        name: group.subject,
        members: group.participants.length,
      }),
      {
        header: {
          content: "💬 WhatsApp Groups",
        },
      }
    )
  );

  sendMessage(getSenderFromMessage(message), { text: reply });
};
