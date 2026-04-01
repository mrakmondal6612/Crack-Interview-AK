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
      <div className="root-layout min-h-screen flex flex-col bg-dark-950">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="root-layout min-h-screen flex flex-col bg-dark-950">
      <Header user={user ? { name: getDisplayName(user), profileURL: user.photoURL || undefined } : undefined} />
      <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-6 pt-[72px]">
        {children}
      </main>
    </div>
  );
}
