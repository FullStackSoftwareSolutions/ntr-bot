import "@next/styles/globals.css";

import { Jost } from "next/font/google";

import Navbar from "@next/components/layouts/Navbar";
import ClientProviders from "@next/providers/ClientProviders";
import { validateRequest } from "@next/auth";
import { SessionProvider } from "@next/providers/SessionProvier";

export const metadata = {
  title: "ntr bot",
  description: "beep boop",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const font = Jost({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  return (
    <SessionProvider value={session}>
      <html lang="en" suppressHydrationWarning className={font.className}>
        <head />
        <body className="flex flex-col">
          <ClientProviders>
            <Navbar />
            <main className="flex flex-1 flex-col overflow-y-auto">
              {children}
            </main>
          </ClientProviders>
        </body>
      </html>
    </SessionProvider>
  );
}
