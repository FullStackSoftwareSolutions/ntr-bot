import { api } from "@next/trpc/react";
import { getNumberFromJid } from "@whatsapp/features/whatsapp/whatsapp.model";
import PlayerCard from "./PlayerCard";

interface PlayerWhatsAppProps {
  className?: string;
  whatsAppJid: string;
}

const PlayerWhatsApp = ({ className, whatsAppJid }: PlayerWhatsAppProps) => {
  const phoneNumber = getNumberFromJid(whatsAppJid);

  const { data: player } = api.players.getByPhoneNumber.useQuery({
    phoneNumber,
  });

  if (!player) {
    return null;
  }

  return <PlayerCard player={player} className={className} />;
};

export default PlayerWhatsApp;
