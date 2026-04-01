"use client";

import Link from "next/link";
import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

export default function Header({ user }: { user?: { name?: string; profileURL?: string } }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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
        
        {user ? (
          <>
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 py-2 sm:py-0 hover:text-primary-300 transition"
                onBlur={(e) => {
                  // Close dropdown when clicking outside
                  setTimeout(() => setProfileDropdownOpen(false), 200);
                }}
              >
                <div className="flex items-center gap-2">
                  {user.profileURL ? (
                    <Image 
                      src={user.profileURL} 
                      alt={user.name || "User"} 
                      width={40} 
                      height={40} 
                      className="rounded-full border border-primary-300 shadow-md cursor-pointer hover:border-primary-400 transition-colors" 
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-400 transition-colors">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <span className="text-primary-100 font-medium text-sm truncate max-w-[100px] hidden sm:block">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-primary-100 hidden sm:block" />
                </div>
              </button>
              
              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-all duration-200"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-all duration-200"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <div className="border-t border-white/10 my-2"></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setProfileDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/10 transition-all duration-200 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Profile Link */}
            <Link 
              href="/profile" 
              className="text-primary-100 font-medium hover:text-primary-300 transition block py-2 sm:py-0 sm:hidden" 
              onClick={() => setMenuOpen(false)}
            >
              My Profile
            </Link>

            {/* Mobile Logout Button */}
            <Button className="ml-0 sm:ml-4 bg-dark-700 text-primary-100 hover:bg-dark-800 w-full sm:w-auto sm:hidden" onClick={handleLogout}>
              Log Out
            </Button>
          </>
        ) : (
          <Link href="/sign-in" className="ml-0 sm:ml-4">
            <Button className="bg-primary-400 text-dark-800 hover:bg-primary-200 w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
