"use client";

import { Button } from "@next/components/ui/button";
import Link from "next/link";
import WhatsAppCard from "./WhatsAppCard";
import { cn } from "@next/lib/utils";

type WhatsAppCardButtonProps = {
  className?: string;
};

const WhatsAppCardButton = ({ className }: WhatsAppCardButtonProps) => {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn("h-auto p-0.5 text-start", className)}
    >
      <Link href="/whatsapp">
        <WhatsAppCard />
      </Link>
    </Button>
  );
};

export default WhatsAppCardButton;
