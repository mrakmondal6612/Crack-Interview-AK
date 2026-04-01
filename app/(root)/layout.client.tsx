"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

import { auth } from "@/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { getDisplayName } from "@/lib/utils/user";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full"></div>
            <div className="relative animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
          </div>
          <p className="text-lg font-medium">Loading InterviewOrbit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950">
      <Header user={user ? { name: getDisplayName(user), profileURL: user.photoURL || undefined } : undefined} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-6 pt-[72px] sm:pt-[80px]">
        {children}
      </main>
    </div>
  );
}
