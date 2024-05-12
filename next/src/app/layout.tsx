import "@next/styles/globals.css";

import { Jost } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@next/components/layouts/Navbar";
import ClientProviders from "@next/providers/ClientProviders";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
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
    </ClerkProvider>
  );
}
