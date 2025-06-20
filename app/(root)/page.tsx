"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { auth } from "@/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";

type Interview = {
  id: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [userInterviews, setUserInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch interviews for this user from your API
        const res = await fetch(`/api/interviews?userId=${firebaseUser.uid}`);
        if (res.ok) {
          const data = await res.json();
          setUserInterviews(data.interviews || []);
        }
      } else {
        setUserInterviews([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview/create">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          style={{ width: "auto", height: "auto" }}
          className="max-sm:hidden"
        />
      </section>

      {user && <div className="mt-8">Welcome, {user.email}!</div>}

      {/* User's Past Interviews */}
      {userInterviews && userInterviews.length > 0 && user && (
        <section className="flex flex-col gap-6 mt-8">
          <h2>Your Interviews</h2>
          <div className="interviews-section flex flex-wrap gap-6">
            {userInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                userId={user.uid}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                userName={user.displayName || user.email || "User"}
                userPhotoUrl={user.photoURL || undefined}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
