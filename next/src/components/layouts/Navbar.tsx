"use client";
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { DarkModeModeToggle } from "../themes/DarkModeToggle";
import Sidebar from "./Sidebar";
import SignInButton from "@next/components/features/auth/SignInButton";
import { useSession } from "@next/providers/SessionProvier";
import SignOutButton from "@next/components/features/auth/SignOutButton";

export const NAVBAR_HEIGHT = 48;
export const REMAINING_SCREEN = `calc(100vh - ${NAVBAR_HEIGHT}px)`;

const Navbar = () => {
  const { user } = useSession();

  return (
    <nav
      className="z-20 overflow-hidden shadow-md dark:shadow-dark sm:px-4"
      style={{
        height: NAVBAR_HEIGHT,
      }}
    >
      <div className="container mx-auto flex h-full items-center gap-2 px-2 py-1">
        {user && <Sidebar />}
        <Link href="/">🤖 ntr bot</Link>
        <div className="ml-auto flex items-center gap-2">
          <DarkModeModeToggle />
          {!user && <SignInButton />}
          {user && (
            <>
              {user.username}
              <SignOutButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
