"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@next/components/ui/sheet";

import { Button } from "../ui/button";
import {
  MenuIcon,
  UserRoundIcon,
  CalendarClockIcon,
  TrophyIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import PlayerIcon from "@next/svg/PlayerIcon";
import WhatsAppIcon from "@next/svg/WhatsAppIcon";
import { VisuallyHidden } from "react-aria";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <VisuallyHidden>
        <SheetTitle>Sidebar</SheetTitle>
      </VisuallyHidden>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-6">
        <Link href="/" onClick={() => setOpen(false)}>
          🤖 ntr bot
        </Link>

        <h2 className="mt-8 mb-2 px-4 text-lg font-semibold tracking-tight">
          Pages
        </h2>
        <div className="flex flex-col gap-1">
          <SidebarLink href="/skates" IconComponent={TrophyIcon}>
            Skates
          </SidebarLink>
          <SidebarLink href="/bookings" IconComponent={CalendarClockIcon}>
            Bookings
          </SidebarLink>
          <SidebarLink href="/players" IconComponent={PlayerIcon}>
            Players
          </SidebarLink>
          <SidebarLink href="/users" IconComponent={UserRoundIcon}>
            Users
          </SidebarLink>
          <SidebarLink href="/whatsapp" IconComponent={WhatsAppIcon}>
            WhatsApp
          </SidebarLink>
        </div>
      </SheetContent>
    </Sheet>
  );
};

type SidebarLinkProps = {
  href: string;
  children: React.ReactNode;
  IconComponent?: React.FunctionComponent<{ className?: string }>;
};

const SidebarLink = ({ IconComponent, href, children }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <SheetClose asChild>
      <Button
        variant="ghost"
        className="group dark:hover:bg-primary hover:bg-primary hover:text-primary-foreground aria-selected:bg-primary/30 aria-selected:hover:bg-primary w-full justify-start"
        aria-selected={isActive}
        asChild
      >
        <Link href={href} className="flex w-full justify-start">
          {IconComponent && (
            <IconComponent
              aria-selected={isActive}
              className="group-hover:text-primary-foreground aria-selected:text-primary mr-2"
            />
          )}
          {children}
        </Link>
      </Button>
    </SheetClose>
  );
};

export default Sidebar;
