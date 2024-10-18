import { getAuthSession } from "@/lib/nextauth";
import Link from "next/link";
import React from "react";
import LoginButton from "./LoginButton";
import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-stone-300 py-8 md:py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-8 h-full gap-2">
        <Link href="/" className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-black px-2 py-1 text-xl font-bold transition-all hover:translate-y-[2px] md:block dark:border-white">
            in10s.id
          </p>
        </Link>
        <div className="flex items-center">
          <ThemeToggle className="mr-3" />
          <div className="flex items-center">
            {session?.user ? (
              <UserAccountNav user={session.user} />
            ) : (
              <LoginButton text="Login" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
