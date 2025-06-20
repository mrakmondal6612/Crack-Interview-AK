"use client";
import { useEffect, useState } from "react";
import AllInterviewsClientWrapper from "@/components/AllInterviewsClientWrapper";
import { auth } from "@/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";

type Interview = {
  id: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
  candidateName?: string;
  candidatePhotoUrl?: string;
};

export default function AllInterviewsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [allCards, setAllCards] = useState<Interview[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      try {
        const res = await fetch("/api/interviews");
        const data = await res.json();
        setAllCards(data.interviews || []);
      } catch {
        setAllCards([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full">
      <h1 className="text-3xl font-bold text-primary-100 mb-4">All Interviews</h1>
      {/* Stats Section */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="bg-dark-800 text-primary-100 rounded-lg px-4 py-2">
          Total Interviews: {allCards.length}
        </div>
        <div className="bg-dark-800 text-primary-100 rounded-lg px-4 py-2">
          My Interviews: {user ? allCards.filter(i => i.userId === user.uid).length : 0}
        </div>
      </div>
      <AllInterviewsClientWrapper
        interviews={allCards}
        userId={user?.uid || ""}
        userName={user?.displayName || user?.email || ""}
        userPhotoUrl={user?.photoURL || ""}
      />
    </div>
  );
}
