"use client";

import { TRPCProvider } from "./TRPCProvider";
import { ThemeProvider } from "./ThemeProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NuqsAdapter>{children}</NuqsAdapter>
      </ThemeProvider>
    </TRPCProvider>
  );
}
