import { db } from "../../db";
import { sendMessage } from "../../whatsapp/whatsapp.service";
import { users as usersTable } from "../../db/schema";
import { stringJoin } from "../../utils";

export default async function command(senderJid: string) {
  const users = await db.select().from(usersTable);

  const messsage = stringJoin(
    "⛸️ Skaters",
    "───────────",
    ...users.map((user) => `- ${user.fullName}`)
  );

  sendMessage(senderJid, messsage);
}
