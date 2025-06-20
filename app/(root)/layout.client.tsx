"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

import { auth } from "@/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="root-layout min-h-screen flex flex-col bg-dark-950">
      <Header user={user ? { name: user.displayName || user.email || "User", profileURL: user.photoURL || undefined } : undefined} />
      <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-6 pt-[72px]">
        {children}
      </main>
    </div>
  );
}
