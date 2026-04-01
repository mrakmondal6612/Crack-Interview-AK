"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { auth } from "@/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { getDisplayName } from "@/lib/utils/user";
import { Sparkles, TrendingUp, Users, Target, ArrowRight, Star, Clock, Award, Code, Globe, Shield, Zap, CheckCircle, BarChart, Brain, Lightbulb, Rocket, Play } from "lucide-react";

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
    <div className="bg-slate-950 text-white overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-green-600/20 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.purple.900/0.4)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,theme(colors.blue.900/0.4)_0%,transparent_50%)]"></div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-purple-600/30 blur-2xl"></div>
            <div className="relative border-t border-b border-white/10 bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-16">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                
                {/* Enhanced Hero Content */}
                <div className="text-center lg:text-left order-2 lg:order-1">
                  <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3 mb-4 sm:mb-6 lg:mb-8 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-400" />
                    <span className="text-purple-200 text-xs sm:text-sm font-medium">AI-Powered Interview Excellence</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse hidden sm:block"></div>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
                    Master Your{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                      Interview
                    </span>{" "}
                    Skills
                  </h1>
                  
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-6 sm:mb-8 lg:mb-10 leading-relaxed font-light">
                    Practice with AI-powered interviews, get instant feedback, and land your dream job with confidence
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8">
                    <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-purple-600/25 text-sm sm:text-base">
                      <Link href="/interview/create" className="flex items-center gap-2 sm:gap-3">
                        <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                        Start Practice
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all backdrop-blur-sm text-sm sm:text-base">
                      <Link href="/interview" className="flex items-center gap-2 sm:gap-3">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                        Watch Demo
                      </Link>
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap gap-3 sm:gap-4 sm:gap-6 justify-center lg:justify-start mb-6 sm:mb-8">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      <span className="text-gray-300 text-xs sm:text-sm">No Credit Card</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      <span className="text-gray-300 text-xs sm:text-sm">Free Forever</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      <span className="text-gray-300 text-xs sm:text-sm">AI-Powered</span>
                    </div>
                  </div>

                  {user && (
                    <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-sm rounded-xl border border-white/10">
                      <p className="text-white text-sm sm:text-base lg:text-lg font-medium">
                        Welcome back, <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{getDisplayName(user)}</span>! 🚀
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">Ready to continue your interview journey?</p>
                    </div>
                  )}
                </div>

                {/* Enhanced Hero Image */}
                <div className="relative order-1 lg:order-2">
                  <div className="relative z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl sm:rounded-3xl blur-2xl"></div>
                    <Image
                      src="/robot.png"
                      alt="AI Interview Assistant"
                      width={400}
                      height={400}
                      className="relative w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full rounded-xl sm:rounded-2xl"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                  <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-16 h-16 sm:w-20 sm:w-24 lg:w-24 h-16 sm:h-20 lg:h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                    <Brain className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center animate-bounce">
                    <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-10 lg:w-10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 blur-2xl"></div>
            <div className="relative border-t border-b border-white/10 bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10">
              
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Trusted by Ambitious Candidates</h2>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg">Join thousands who've transformed their interview skills</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
                <div className="group">
                  <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">1000+</div>
                  <p className="text-gray-400 text-xs sm:text-sm">Interview Questions</p>
                </div>
                <div className="group">
                  <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">50+</div>
                  <p className="text-gray-400 text-xs sm:text-sm">Companies Covered</p>
                </div>
                <div className="group">
                  <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">95%</div>
                  <p className="text-gray-400 text-xs sm:text-sm">Success Rate</p>
                </div>
                <div className="group">
                  <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">24/7</div>
                  <p className="text-gray-400 text-xs sm:text-sm">AI Availability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <span className="text-purple-200 text-xs sm:text-sm font-medium">Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">Why InterviewOrbit Stands Out</h2>
            <p className="text-gray-300 text-base sm:text-lg xl:text-xl max-w-3xl mx-auto">
              Cutting-edge AI technology meets proven interview strategies for unmatched results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-purple-800/30 blur-2xl rounded-2xl sm:rounded-3xl group-hover:blur-3xl transition-all"></div>
              <div className="relative border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:scale-105 transition-all duration-300 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">Real-World Scenarios</h3>
                <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                  Practice with actual interview questions from top companies like Google, Microsoft, and Amazon
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                  <span className="px-2 sm:px-3 py-1 bg-purple-600/20 rounded-full text-xs text-purple-300">FAANG</span>
                  <span className="px-2 sm:px-3 py-1 bg-purple-600/20 rounded-full text-xs text-purple-300">Startups</span>
                  <span className="px-2 sm:px-3 py-1 bg-purple-600/20 rounded-full text-xs text-purple-300">Enterprise</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-blue-800/30 blur-2xl rounded-2xl sm:rounded-3xl group-hover:blur-3xl transition-all"></div>
              <div className="relative border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:scale-105 transition-all duration-300 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">Instant AI Feedback</h3>
                <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                  Get detailed, actionable feedback on your answers within seconds, powered by advanced AI
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                  <span className="px-2 sm:px-3 py-1 bg-blue-600/20 rounded-full text-xs text-blue-300">Real-time</span>
                  <span className="px-2 sm:px-3 py-1 bg-blue-600/20 rounded-full text-xs text-blue-300">Detailed</span>
                  <span className="px-2 sm:px-3 py-1 bg-blue-600/20 rounded-full text-xs text-blue-300">Actionable</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/30 to-green-800/30 blur-2xl rounded-2xl sm:rounded-3xl group-hover:blur-3xl transition-all"></div>
              <div className="relative border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:scale-105 transition-all duration-300 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <BarChart className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">Progress Analytics</h3>
                <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                  Track your improvement over time with detailed analytics and personalized recommendations
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                  <span className="px-2 sm:px-3 py-1 bg-green-600/20 rounded-full text-xs text-green-300">Analytics</span>
                  <span className="px-2 sm:px-3 py-1 bg-green-600/20 rounded-full text-xs text-green-300">Reports</span>
                  <span className="px-2 sm:px-3 py-1 bg-green-600/20 rounded-full text-xs text-green-300">Insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced User's Past Interviews */}
      {userInterviews && userInterviews.length > 0 && user && (
        <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 blur-2xl"></div>
              <div className="relative border-t border-b border-white/10 bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10">
                
                <div className="text-center mb-8 sm:mb-12">
                  <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                    <span className="text-purple-200 text-xs sm:text-sm font-medium">Recent Activity</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Your Interview Journey</h2>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                    Continue where you left off and track your progress
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
                  <div className="text-center mt-8 sm:mt-12">
                    <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg text-sm sm:text-base">
                      <Link href="/interview" className="flex items-center gap-2 sm:gap-3">
                        View All Interviews
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced CTA Section */}
      {!user && (
        <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-purple-600/30 blur-3xl"></div>
              <div className="relative border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-16">
                <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                  <span className="text-green-200 text-xs sm:text-sm font-medium">Get Started Free</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                  Ready to Land Your Dream Job?
                </h2>
                <p className="text-base sm:text-lg xl:text-xl text-gray-300 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto">
                  Join thousands of candidates who've transformed their interview skills and secured offers from top companies
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all hover:scale-105 shadow-lg shadow-purple-600/25">
                    <Link href="/sign-in" className="flex items-center gap-2 sm:gap-3">
                      <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                      Start Free Trial
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all backdrop-blur-sm">
                    <Link href="/interview" className="flex items-center gap-2 sm:gap-3">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                      Watch Demo
                    </Link>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4 sm:gap-6 justify-center text-xs sm:text-sm text-gray-400">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
