"use client";
import { useEffect, useState } from "react";
import AllInterviewsClientWrapper from "@/components/AllInterviewsClientWrapper";
import { auth } from "@/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { getDisplayName } from "@/lib/utils/user";
import { Users, UserCheck, Search, Filter, TrendingUp } from "lucide-react";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      try {
        const res = await fetch("/api/interviews");
        const data = await res.json();
        setAllCards(data.interviews || []);
      } catch {
        setAllCards([]);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const totalInterviews = allCards.length;
  const myInterviews = user ? allCards.filter(i => i.userId === user.uid).length : 0;
  const otherInterviews = totalInterviews - myInterviews;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
          Loading interviews...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 py-6 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
            All Interviews
          </h1>
          <p className="text-purple-200 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Explore interview sessions from the community and practice with real-world scenarios
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-purple-500/30 p-4 sm:p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-xs sm:text-sm mb-1">Total Interviews</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">{totalInterviews}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-purple-500/30 p-4 sm:p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-xs sm:text-sm mb-1">My Interviews</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">{myInterviews}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600/20 rounded-full flex items-center justify-center">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-purple-500/30 p-4 sm:p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-xs sm:text-sm mb-1">Community</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">{otherInterviews}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-purple-500/30 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search interviews by role, type, or technology..."
                className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-colors text-sm sm:text-base"
              />
            </div>
            <button className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-200 hover:bg-purple-600/30 transition-colors text-sm sm:text-base">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>

        {/* Interview Cards */}
        <AllInterviewsClientWrapper
          interviews={allCards}
          userId={user?.uid || ""}
          userName={getDisplayName(user)}
          userPhotoUrl={user?.photoURL || ""}
        />
      </div>
    </div>
  );
}
