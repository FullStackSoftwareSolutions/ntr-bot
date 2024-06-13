"use client";

import { useWhatsApp } from "@next/hooks/features/useWhatsApp";
import { cn } from "@next/lib/utils";

type WhatsAppJidProps = {
  className?: string;
};

const WhatsAppJid = ({ className }: WhatsAppJidProps) => {
  const { jid } = useWhatsApp();

  if (jid == null) {
    return null;
  }

  return <p className={cn("text-lg text-foreground/60", className)}>{jid}</p>;
};

export default WhatsAppJid;
