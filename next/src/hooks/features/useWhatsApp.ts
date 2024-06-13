import { api } from "@next/trpc/react";
import { useEffect, useState } from "react";

export const useWhatsApp = () => {
  const [lastError, setLastError] = useState<string | null>(null);
  const { data, error } = api.whatsapp.getConnection.useQuery(undefined, {
    retry: 0,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (error != null) {
      return setLastError(error.message);
    }
    if (data != null) {
      return setLastError(null);
    }
  }, [error, data]);

  const whtasAppData = lastError ? null : data;

  return {
    status: whtasAppData?.status,
    jid: whtasAppData?.jid,
    qr: whtasAppData?.qr,
    error: lastError,
  };
};
