"use client";

import WhatsAppJid from "@next/components/features/whatsapp/WhatsAppJid";
import WhatsAppStatusBadge from "@next/components/features/whatsapp/WhatsAppStatusBadge";
import { Card } from "@next/components/ui/card";
import WhatsAppIcon from "@next/svg/WhatsAppIcon";

import { cn } from "@next/lib/utils";

type WhatsAppCardProps = {
  className?: string;
};

const WhatsAppCard = ({ className }: WhatsAppCardProps) => {
  return (
    <Card
      className={cn(
        "flex items-center gap-4 overflow-hidden p-8 hover:bg-card/90",
        className,
      )}
    >
      <WhatsAppIcon className="size-[60px] text-green-400" />
      <div className="flex-col gap-2">
        <h1 className="flex items-center gap-4 text-4xl font-bold">WhatsApp</h1>
        <div className="flex items-center gap-2">
          <WhatsAppStatusBadge />
          <WhatsAppJid />
        </div>
      </div>
    </Card>
  );
};

export default WhatsAppCard;
