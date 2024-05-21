"use client";

import { Badge } from "@next/components/ui/badge";
import { api } from "@next/trpc/react";
import QRCode from "react-qr-code";

const WhatsAppQrCode = () => {
  const { data } = api.whatsapp.getConnection.useQuery();

  if (data == null) {
    return null;
  }

  return (
    <div className="text-2xl">
      <h1 className="flex items-center gap-3">
        WhatsApp
        <Badge>{data.status}</Badge>
      </h1>
      {data.qr != null && (
        <div>
          <h2>WhatsApp QR Code</h2>
          <p>Scan the QR code to connect to WhatsApp</p>
          <div className="bg-white p-4">
            <QRCode value={data.qr} />
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppQrCode;
