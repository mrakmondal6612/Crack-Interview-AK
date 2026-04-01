"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { auth } from "@/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { getDisplayName } from "@/lib/utils/user";
import { Sparkles, TrendingUp, Users, Target, ArrowRight, Star, Clock, Award } from "lucide-react";

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
        try {
          const res = await fetch(`/api/interviews?userId=${firebaseUser.uid}`);
          if (res.ok) {
            const data = await res.json();
            const uniqueInterviews = (data.interviews || []).filter((interview: Interview, index: number, self: Interview[]) =>
              index === self.findIndex((i) => i.id === interview.id)
            );
            setUserInterviews(uniqueInterviews);
          }
        } catch (error) {
          console.error("Error fetching interviews:", error);
        }
      } else {
        setUserInterviews([]);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
      {/* Hero Section - Original Design */}
      <section className="card-cta py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex flex-col gap-6 max-w-lg">
              <h2 className="text-4xl font-bold text-white">Get Interview-Ready with AI-Powered Practice & Feedback</h2>
              <p className="text-lg text-purple-200">
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

              {user && (
                <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <p className="text-white text-lg">
                    Welcome back, <span className="font-semibold text-purple-300">{getDisplayName(user)}</span>! 👋
                  </p>
                </div>
              )}
            </div>

            <Image
              src="/robot.png"
              alt="AI Interview Assistant"
              width={400}
              height={400}
              style={{ width: "auto", height: "auto" }}
              className="max-sm:hidden"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose InterviewOrbit?</h2>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Advanced AI technology meets interview preparation for the best results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30 p-8 hover:scale-105 transition-transform duration-300 text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real Scenarios</h3>
              <p className="text-purple-200">
                Practice with actual interview questions from top companies in your field
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30 p-8 hover:scale-105 transition-transform duration-300 text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Instant Feedback</h3>
              <p className="text-purple-200">
                Get detailed AI-powered feedback on your answers immediately
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30 p-8 hover:scale-105 transition-transform duration-300 text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Track Progress</h3>
              <p className="text-purple-200">
                Monitor your improvement over time with detailed analytics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <p className="text-purple-200">Interview Questions</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <p className="text-purple-200">Companies Covered</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <p className="text-purple-200">Success Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <p className="text-purple-200">AI Availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* User's Past Interviews */}
      {userInterviews && userInterviews.length > 0 && user && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Your Recent Interviews</h2>
              <p className="text-purple-200 text-lg">
                Continue your interview practice journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userInterviews.slice(0, 6).map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interviewId={interview.id}
                  userId={user.uid}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                  candidateName={getDisplayName(user)}
                  candidatePhotoUrl={user.photoURL || undefined}
                />
              ))}
            </div>

            {userInterviews.length > 6 && (
              <div className="text-center mt-12">
                <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href="/interview" className="flex items-center gap-2">
                    View All Interviews
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30 p-12">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Ace Your Interview?</h2>
              <p className="text-xl text-purple-200 mb-8">
                Join thousands of candidates who've improved their interview skills with InterviewOrbit
              </p>
              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all hover:scale-105">
                <Link href="/sign-in">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
