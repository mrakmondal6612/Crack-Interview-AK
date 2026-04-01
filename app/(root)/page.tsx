"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { auth } from "@/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { getDisplayName } from "@/lib/utils/user";

type Interview = {
  id: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
  userId: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userInterviews, setUserInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        // Fetch interviews for this user from your API
        const res = await fetch(`/api/interviews?userId=${firebaseUser.uid}`);
        if (res.ok) {
          const data = await res.json();
          // Remove duplicates by interview id
          const uniqueInterviews = (data.interviews || []).filter((interview: Interview, index: number, self: Interview[]) =>
            index === self.findIndex((i) => i.id === interview.id)
          );
          setUserInterviews(uniqueInterviews);
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

          <div className="flex gap-4 max-sm:w-full">
            <Button asChild className="btn-primary flex-1 max-sm:w-full">
              <Link href="/interview/create">Create Interview</Link>
            </Button>
            <Button asChild variant="outline" className="btn-secondary flex-1 max-sm:w-full">
              <Link href="/interview">Start Interview</Link>
            </Button>
          </div>
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

      {!loading && user && <div className="mt-8">Welcome, {getDisplayName(user)}!</div>}

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
                candidateName={
                  user.uid === interview.userId
                    ? getDisplayName(user)
                    : undefined
                }
                candidatePhotoUrl={
                  user.uid === interview.userId
                    ? (user.photoURL || undefined)
                    : undefined
                }
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
