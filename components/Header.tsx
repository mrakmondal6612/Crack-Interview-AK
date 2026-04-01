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
    <header className="w-full bg-slate-950/90 backdrop-blur-md shadow-lg py-3 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-white/10 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 min-w-0">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-600/20 blur-lg rounded-full"></div>
          <Image src="/logo.svg" alt="logo" width={32} height={32} style={{ width: "auto", height: "auto" }} className="relative" />
        </div>
        <span className="font-bold text-lg sm:text-xl text-white truncate">InterviewOrbit</span>
      </Link>
      
      {/* Mobile Menu Button */}
      <button 
        className="sm:hidden ml-2 p-2 rounded-lg hover:bg-white/10 transition-colors" 
        onClick={() => setMenuOpen(!menuOpen)} 
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 flex flex-col justify-center gap-1">
          <span className={`block h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </div>
      </button>
      
      {/* Navigation */}
      <nav className={`flex-col sm:flex-row sm:flex items-center gap-4 sm:gap-6 ${menuOpen ? 'flex' : 'hidden'} sm:!flex absolute sm:static top-16 left-0 w-full sm:w-auto bg-slate-950/95 sm:bg-transparent p-4 sm:p-0 border-t sm:border-t-0 border-white/10 sm:border-transparent transition-all`}> 
        <Link 
          href="/interview" 
          className="text-white font-medium hover:text-purple-400 transition-colors block py-3 sm:py-0 px-3 sm:px-0 rounded-lg hover:bg-white/5 sm:hover:bg-transparent" 
          onClick={() => setMenuOpen(false)}
        >
          All Interviews
        </Link>
        
        {user ? (
          <>
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 py-2 sm:py-0 hover:text-purple-400 transition-colors w-full sm:w-auto justify-start sm:justify-center px-3 sm:px-0 rounded-lg hover:bg-white/5 sm:hover:bg-transparent"
                onBlur={(e) => {
                  setTimeout(() => setProfileDropdownOpen(false), 200);
                }}
              >
                <div className="flex items-center gap-2">
                  {user.profileURL ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-600/20 blur-md rounded-full"></div>
                      <Image 
                        src={user.profileURL} 
                        alt={user.name || "User"} 
                        width={40} 
                        height={40} 
                        className="relative rounded-full border-2 border-purple-500/50 cursor-pointer hover:border-purple-400 transition-all" 
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:from-purple-700 hover:to-blue-700 transition-all">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <span className="text-white font-medium text-sm truncate max-w-[100px] sm:block hidden">
                    {user.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-white transition-transform sm:block hidden ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              
              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 sm:right-auto top-full mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl py-2 z-50 sm:z-50">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-all duration-200 rounded-lg"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4 text-purple-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-all duration-200 rounded-lg"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    <Settings className="w-4 h-4 text-blue-400" />
                    <span>Settings</span>
                  </Link>
                  <div className="border-t border-white/10 my-2"></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setProfileDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/10 transition-all duration-200 w-full text-left rounded-lg"
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
              className="text-white font-medium hover:text-purple-400 transition-colors block py-3 sm:py-0 px-3 sm:px-0 rounded-lg hover:bg-white/5 sm:hover:bg-transparent sm:hidden" 
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-purple-400" />
                My Profile
              </div>
            </Link>

            {/* Mobile Settings Link */}
            <Link 
              href="/settings" 
              className="text-white font-medium hover:text-purple-400 transition-colors block py-3 sm:py-0 px-3 sm:px-0 rounded-lg hover:bg-white/5 sm:hover:bg-transparent sm:hidden" 
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-blue-400" />
                Settings
              </div>
            </Link>

            {/* Mobile Logout Button */}
            <Button 
              className="ml-0 sm:ml-4 bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 w-full sm:w-auto sm:hidden" 
              onClick={handleLogout}
            >
              <div className="flex items-center gap-2 justify-center">
                <LogOut className="w-4 h-4" />
                Log Out
              </div>
            </Button>
          </>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link href="/sign-in" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 font-medium">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
