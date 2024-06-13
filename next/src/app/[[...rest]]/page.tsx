import SignedIn from "@next/components/features/auth/SignedIn";
import SignedOut from "@next/components/features/auth/SignedOut";
import SignInButton from "@next/components/features/auth/SignInButton";
import WhatsAppJid from "@next/components/features/whatsapp/WhatsAppJid";
import WhatsAppStatusBadge from "@next/components/features/whatsapp/WhatsAppStatusBadge";
import { Button } from "@next/components/ui/button";
import { Card } from "@next/components/ui/card";
import WhatsAppIcon from "@next/svg/WhatsAppIcon";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container flex flex-1 flex-col gap-6 p-8">
      <div className="m-16 flex flex-col items-center gap-2">
        <h1 className="text-4xl">🤖 beep boop</h1>
        <SignedOut>
          <h2 className="text-lg">Sign in or sign up below</h2>
        </SignedOut>
      </div>
      <SignedOut>
        <div className="flex gap-4">
          <Button asChild>
            <SignInButton />
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className-="container flex">
          <Button asChild variant="ghost" className="h-auto p-0.5 text-start">
            <Link href="whatsapp">
              <Card className="flex items-center gap-4 overflow-hidden p-8 hover:bg-card/90">
                <WhatsAppIcon className="size-[60px] text-green-400" />
                <div className="flex-col gap-2">
                  <h1 className="flex items-center gap-4 text-4xl font-bold">
                    WhatsApp
                  </h1>
                  <div className="flex items-center gap-2">
                    <WhatsAppStatusBadge />
                    <WhatsAppJid />
                  </div>
                </div>
              </Card>
            </Link>
          </Button>
        </div>
      </SignedIn>
    </div>
  );
}
