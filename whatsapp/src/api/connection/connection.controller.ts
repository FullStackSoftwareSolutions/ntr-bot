import {
  getConnectionStatus,
  getQrCode,
} from "@whatsapp/features/whatsapp/whatsapp.controller";
import {
  getAllChats,
  getAllGroups,
  getUserJid,
  logout,
} from "@whatsapp/integrations/whatsapp/whatsapp.service";

export const getConnectionStatusHandler = async () => {
  return {
    status: getConnectionStatus(),
    qr: getQrCode(),
    jid: getUserJid(),
  };
};

export const resetConnectionHandler = async () => {
  return logout();
};

export const getGroupsHandler = async () => {
  return getAllGroups();
};

export const getChatsHandler = async () => {
  return getAllChats();
};
