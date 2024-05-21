import {
  getConnectionStatus,
  getQrCode,
} from "@whatsapp/features/whatsapp/whatsapp.controller";

export const getConnectionStatusHandler = async () => {
  return {
    status: getConnectionStatus(),
    qr: getQrCode(),
  };
};
