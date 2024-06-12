"use client";

import { Badge } from "@next/components/ui/badge";
import { api } from "@next/trpc/react";
import { CircleXIcon } from "lucide-react";
import QRCode from "react-qr-code";
import WhatsAppMoreOptions from "./WhatsAppMoreOptions";
import { useEffect, useState } from "react";

const WhatsAppQrCode = () => {
  const [lastError, setLastError] = useState<string | null>(null);
  const { data, errorUpdateCount, error, failureReason } =
    api.whatsapp.getConnection.useQuery(undefined, {
      retry: 0,
      refetchInterval: 1000,
    });

  useEffect(() => {
    if (error != null) {
      setLastError(error.message);
    }
  }, [error]);

  if (errorUpdateCount > 0 && lastError) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <CircleXIcon className="text-destructive" />
          <p>{lastError}</p>
        </div>
        <p>
          {errorUpdateCount} attempt{errorUpdateCount > 1 ? "s" : ""}
        </p>
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
