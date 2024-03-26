import { useWhatsappAuth } from "../../integrations/whatsapp/whatsapp.auth";
import { initialize } from "../../integrations/whatsapp/whatsapp.service";
import {
  deleteWhatsappAuthData,
  getWhatsappAuthData,
  upsertWhatsappAuthData,
} from "./whatsapp.db";

export const connectToWhatsapp = async () => {
  const auth = await useWhatsappAuth({
    deleteData: deleteWhatsappAuthData,
    writeData: upsertWhatsappAuthData,
    readData: getWhatsappAuthData,
  });

  return initialize(auth);
};
