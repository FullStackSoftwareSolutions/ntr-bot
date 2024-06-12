"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
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

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <Link href="/" onClick={() => setOpen(false)}>
          🤖 ntr bot
        </Link>

        <h2 className="mb-2 mt-8 px-4 text-lg font-semibold tracking-tight">
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
        className="group w-full justify-start hover:bg-primary hover:text-primary-foreground aria-selected:bg-primary/30 aria-selected:hover:bg-primary"
        aria-selected={isActive}
        asChild
      >
        <Link href={href} className="flex w-full justify-start">
          {IconComponent && (
            <IconComponent
              aria-selected={isActive}
              className="mr-2 group-hover:text-primary-foreground aria-selected:text-primary"
            />
          )}
          {children}
        </Link>
      </Button>
    </SheetClose>
  );
};

export default Sidebar;
