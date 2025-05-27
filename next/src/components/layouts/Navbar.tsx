"use client";

import Link from "next/link";
import { DarkModeModeToggle } from "../themes/DarkModeToggle";
import Sidebar from "./Sidebar";
import SignInButton from "@next/components/features/auth/SignInButton";
import { useSession } from "@next/providers/SessionProvier";
import SignOutButton from "@next/components/features/auth/SignOutButton";
import SignedIn from "../features/auth/SignedIn";
import SignedOut from "../features/auth/SignedOut";
import SignedInUserButton from "../features/users/SignedInUserPopover";

export const NAVBAR_HEIGHT = 48;
export const REMAINING_SCREEN = `calc(100vh - ${NAVBAR_HEIGHT}px)`;

const Navbar = () => {
  const { user } = useSession();

  return (
    <nav
      className="dark:shadow-dark z-20 overflow-hidden shadow-md sm:px-4"
      style={{
        height: NAVBAR_HEIGHT,
      }}
    >
      <div className="mx-auto flex h-full items-center gap-2 px-2 py-1">
        <SignedIn>
          <Sidebar />
        </SignedIn>
        <Link href="/">🤖 ntr bot</Link>
        <div className="ml-auto flex items-center gap-2">
          <DarkModeModeToggle />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <SignedInUserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
