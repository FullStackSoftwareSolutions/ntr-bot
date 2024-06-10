"use client";

import { Badge } from "@next/components/ui/badge";
import { api } from "@next/trpc/react";
import { CircleXIcon } from "lucide-react";
import QRCode from "react-qr-code";
import WhatsAppMoreOptions from "./WhatsAppMoreOptions";

const WhatsAppQrCode = () => {
  const { data, error } = api.whatsapp.getConnection.useQuery(undefined, {
    refetchInterval: 1000,
  });

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <CircleXIcon className="text-destructive" /> {error.message}
      </div>
    );
  }

  if (data == null) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8 text-2xl">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-3">
          WhatsApp
          <Badge
            variant={
              data.status === "open"
                ? "default"
                : data.status === "close"
                  ? "destructive"
                  : "outline"
            }
          >
            {data.status}
          </Badge>
          <WhatsAppMoreOptions />
        </h1>
        {data.jid != null && <p className="text-sm">{data.jid}</p>}
      </div>
      {data.qr != null && (
        <div className="flex flex-col gap-2">
          <p className="text-sm">Scan the QR code to connect to WhatsApp</p>
          <div className="rounded-md bg-white p-2">
            <QRCode value={data.qr} />
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppQrCode;
