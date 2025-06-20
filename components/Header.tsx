"use client";

import Link from "next/link";
import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

export default function Header({ user }: { user?: { name?: string; profileURL?: string } }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await signOut();
    router.push("/sign-in");
  }

  return (
    <header className="w-full bg-dark-900 shadow-md py-3 px-4 sm:px-6 flex items-center justify-between border-b border-dark-700 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <Link href="/" className="flex items-center gap-2 min-w-0">
        <Image src="/logo.svg" alt="logo" width={32} height={32} style={{ width: "auto", height: "auto" }} />
        <span className="font-bold text-lg text-primary-100 truncate">InterviewOrbit</span>
      </Link>
      <button className="sm:hidden ml-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary-100">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <nav className={`flex-col sm:flex-row sm:flex items-center gap-6 ${menuOpen ? 'flex' : 'hidden'} sm:!flex absolute sm:static top-16 left-0 w-full sm:w-auto bg-dark-900/90 sm:bg-transparent p-4 sm:p-0 transition-all`}> 
        <Link href="/interview" className="text-primary-100 font-medium hover:text-primary-300 transition block py-2 sm:py-0" onClick={() => setMenuOpen(false)}>
          All Interviews
        </Link>
        <Link href="/profile" className="text-primary-100 font-medium hover:text-primary-300 transition block py-2 sm:py-0" onClick={() => setMenuOpen(false)}>
          My Profile
        </Link>
        {user && (
          <div className="flex flex-col items-center gap-1 py-2 sm:py-0">
            {user.profileURL && (
              <Image src={user.profileURL} alt={user.name || "User"} width={40} height={40} className="rounded-full border border-primary-300 shadow-md" />
            )}
            <span className="text-primary-100 font-medium text-xs truncate max-w-[120px] mt-1 text-center bg-dark-800/80 px-2 py-0.5 rounded">
              {user.name}
            </span>
          </div>
        )}
        <Button className="ml-0 sm:ml-4 bg-dark-700 text-primary-100 hover:bg-dark-800 w-full sm:w-auto" onClick={handleLogout}>
          Log Out
        </Button>
      </nav>
    </header>
  );
}
