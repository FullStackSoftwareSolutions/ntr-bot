"use client";

import QRCode from "react-qr-code";
import { useWhatsApp } from "@next/hooks/features/useWhatsApp";
import { cn } from "@next/lib/utils";

type WhatsAppQrCodeProps = {
  className?: string;
};

const WhatsAppQrCode = ({ className }: WhatsAppQrCodeProps) => {
  const { qr } = useWhatsApp();

  if (qr == null) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-sm">Scan the QR code in WhatsApp linked devices</p>
      <div className="self-start rounded-md bg-white p-2">
        <QRCode value={qr} />
      </div>
    </div>
  );
};

export default WhatsAppQrCode;
