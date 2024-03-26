import { formatTable } from "../../features/whatsapp/whatsapp.formatting";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import { commands, getCommandDescription } from "../commands";

export const execute = (senderJid: string) => {
  const message = formatTable(
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

  sendMessage(senderJid, {
    poll: {
      name: "test",
      values: ["option1", "option2", "option3"],
    },
  });
};
