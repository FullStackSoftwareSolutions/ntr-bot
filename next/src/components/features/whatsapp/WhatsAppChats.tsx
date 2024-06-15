"use client";

import { Card } from "@next/components/ui/card";
import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import PlayerWhatsApp from "../players/PlayerWhatsApp";

type WhatsAppChatsProps = {
  className?: string;
};

const WhatsAppChats = ({ className }: WhatsAppChatsProps) => {
  const { data: chats } = api.whatsapp.getChats.useQuery();

  if (chats == null) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-start gap-2", className)}>
      {chats.map((chat) => (
        <Card
          className="flex flex-col items-start gap-2 p-2 px-4"
          key={chat.id}
        >
          <h2 className="flex items-center gap-2">
            <div>{chat.contact?.name ?? chat.name ?? chat.id}</div>
            <div className="text-sm text-foreground/60">({chat.id})</div>
          </h2>
          <PlayerWhatsApp whatsAppJid={chat.id} />
        </Card>
      ))}
    </div>
  );
};

export default WhatsAppChats;
