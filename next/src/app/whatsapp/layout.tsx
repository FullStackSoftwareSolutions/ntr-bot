"use client";

import WhatsAppJid from "@next/components/features/whatsapp/WhatsAppJid";
import WhatsAppMoreOptions from "@next/components/features/whatsapp/WhatsAppMoreOptions";
import WhatsAppQrCode from "@next/components/features/whatsapp/WhatsAppQrCode";
import WhatsAppStatusBadge from "@next/components/features/whatsapp/WhatsAppStatusBadge";
import PageHeader from "@next/components/layouts/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@next/components/ui/tabs";
import { useWhatsApp } from "@next/hooks/features/useWhatsApp";
import WhatsAppIcon from "@next/svg/WhatsAppIcon";
import { CircleXIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type WhatsAppPageProps = {
  children: React.ReactNode;
};

const getTab = (pathname: string | null) => {
  const tab = pathname?.split("whatsapp").pop()?.replace("/", "");
  if (tab?.length) {
    return tab;
  }
  return "groups";
};

export default function WhatsAppLayout({ children }: WhatsAppPageProps) {
  const pathname = usePathname();
  const router = useRouter();

  const tab = getTab(pathname);
  const whatsApp = useWhatsApp();

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader>
        <div className="flex items-center gap-4">
          <WhatsAppIcon className="size-[60px] text-green-400" />
          <div className="flex-col gap-2">
            <h1 className="flex items-center gap-4 text-4xl font-bold">
              WhatsApp
              <WhatsAppMoreOptions />
            </h1>
            <div className="flex items-center gap-2">
              <WhatsAppStatusBadge />
              <WhatsAppJid />
            </div>
          </div>
        </div>
      </PageHeader>

      {!!whatsApp.error && (
        <div className="container flex items-center gap-2">
          <CircleXIcon className="text-destructive" />
          <p>WhatsApp server unavailable</p>
        </div>
      )}

      {whatsApp.qr && <WhatsAppQrCode className="container" />}

      {!!whatsApp.jid && (
        <>
          <Tabs
            className="hide-scrollbar sm:show-scrollbar container mb-4 flex overflow-y-auto"
            value={tab}
            onValueChange={(tab) => {
              if (tab === "groups") {
                return router.push(`/whatsapp`);
              }
              return router.push(`/whatsapp/${tab}`);
            }}
          >
            <TabsList>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="chats">Chats</TabsTrigger>
            </TabsList>
          </Tabs>

          <section className="flex flex-1 flex-col md:container md:mx-auto">
            {children}
          </section>
        </>
      )}
    </div>
  );
}
