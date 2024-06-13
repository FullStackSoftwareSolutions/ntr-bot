"use client";

import { Badge } from "@next/components/ui/badge";
import { useWhatsApp } from "@next/hooks/features/useWhatsApp";

const WhatsAppStatusBadge = () => {
  const { status } = useWhatsApp();

  if (!status) {
    return null;
  }

  return (
    <Badge
      variant={
        status === "open"
          ? "default"
          : status === "close"
            ? "destructive"
            : "outline"
      }
    >
      {status}
    </Badge>
  );
};

export default WhatsAppStatusBadge;
