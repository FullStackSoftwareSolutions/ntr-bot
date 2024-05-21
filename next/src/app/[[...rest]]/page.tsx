import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import WhatsAppQrCode from "@next/components/features/whatsapp/WhatsAppQrCode";
import { Button } from "@next/components/ui/button";

export default function Home() {
  return (
    <div className="container flex flex-1 flex-col items-center gap-6 p-8">
      <div className="m-32 flex flex-col items-center gap-2">
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
          <Button asChild>
            <SignUpButton />
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <WhatsAppQrCode />
      </SignedIn>
    </div>
  );
}
