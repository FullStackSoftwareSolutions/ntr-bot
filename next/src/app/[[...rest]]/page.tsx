import SignedIn from "@next/components/features/auth/SignedIn";
import SignedOut from "@next/components/features/auth/SignedOut";
import SignInButton from "@next/components/features/auth/SignInButton";
import WhatsAppCardButton from "@next/components/features/whatsapp/WhatsAppCardButton";
import { Button } from "@next/components/ui/button";

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
        <div className="container flex">
          <WhatsAppCardButton />
        </div>
      </SignedIn>
    </div>
  );
}
