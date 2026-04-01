import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Briefcase, BarChart3, MessageSquare } from "lucide-react";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <Link 
            href="/interview" 
            className="inline-flex items-center text-white hover:text-purple-300 mb-6 transition-colors"
          >
            ← Back to Interviews
          </Link>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Interview Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white capitalize">
                      {interview.role} Interview
                    </h1>
                    <p className="text-purple-200">{interview.type}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-purple-200">
                    <BarChart3 className="w-4 h-4" />
                    <span className="capitalize">{interview.level}</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-200">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(interview.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="relative">
                    <Image
                      src="/ai-avatar.png"
                      alt="AI Interviewer"
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-purple-500 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">AI</span>
                    </div>
                  </div>
                  <p className="text-xs text-purple-200 mt-2 font-medium">Interviewer</p>
                </div>
                
                <div className="w-8 h-px bg-purple-400/50"></div>
                
                {(user?.profileURL) && (
                  <div className="text-center">
                    <div className="relative">
                      <Image
                        src={user.profileURL}
                        alt={user.name || "Candidate"}
                        width={80}
                        height={80}
                        className="rounded-full border-2 border-green-500 shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <p className="text-xs text-purple-200 mt-2 font-medium">
                      {user.name || "Candidate"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
            Tech Stack
          </h2>
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <DisplayTechIcons techStack={interview.techstack} />
          </div>
        </div>

        {/* Questions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            Interview Questions
          </h2>
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            {Array.isArray(interview.questions) && interview.questions.length > 0 ? (
              <div className="space-y-3">
                {interview.questions.map((q, i) => (
                  <div 
                    key={i} 
                    className="flex gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <span className="flex-shrink-0 w-7 h-7 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-sm font-medium">
                      {i + 1}
                    </span>
                    <p className="text-white">{q}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-purple-200 italic">No questions found for this interview.</p>
            )}
          </div>
        </div>

        {/* Feedback Summary */}
        {feedback && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Feedback Summary
            </h2>
            <div className="bg-gradient-to-r from-purple-900/50 to-green-900/50 backdrop-blur-md rounded-xl border border-purple-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {feedback.totalScore}/100
                  </h3>
                  <p className="text-purple-200 text-sm">
                    Overall Score
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-purple-200 text-sm">
                    {formatDate(feedback.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-white leading-relaxed">{feedback.finalAssessment}</p>
              </div>

              <div className="flex gap-4">
                <Button asChild className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <Link href={`/interview/${id}/feedback`}>
                    View Detailed Feedback
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 border-purple-600 text-white hover:bg-purple-900/20">
                  <Link href={`/interview/${id}/call`}>
                    Retake Interview
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons (if no feedback) */}
        {!feedback && (
          <div className="flex gap-4">
            <Button asChild className="flex-1 bg-purple-600 hover:bg-purple-700">
              <Link href={`/interview/${id}/call`}>
                Start Interview
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewDetails;
