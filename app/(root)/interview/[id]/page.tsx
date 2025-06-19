import Image from "next/image";
import { redirect } from "next/navigation";

import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <>
      <div className="flex flex-col gap-6 mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Interview Details</h2>
        <div className="flex flex-row gap-8 items-center">
          {/* Interviewer (AI) */}
          <div className="flex flex-col items-center">
            <Image
              src="/ai-avatar.png"
              alt="AI Interviewer"
              width={60}
              height={60}
              className="rounded-full object-cover size-[60px] border-2 border-primary-200"
            />
            <span className="text-xs mt-1 font-semibold text-primary-400">
              AI Interviewer
            </span>
          </div>
          {/* Candidate */}
          {(user?.profileURL || user?.photoURL) && (
            <div className="flex flex-col items-center ml-4">
              <Image
                src={user.profileURL || user.photoURL}
                alt={user.name || "Candidate"}
                width={60}
                height={60}
                className="rounded-full object-cover size-[60px] border-2 border-primary-400"
              />
              <span className="text-xs mt-1 font-semibold text-primary-400">
                {user.name}
              </span>
            </div>
          )}
          <div className="ml-8">
            <h3 className="capitalize text-lg font-semibold">
              {interview.role} Interview
            </h3>
            <p className="text-sm text-gray-500">{interview.type}</p>
            <p className="text-sm text-gray-500">Level: {interview.level}</p>
            <p className="text-sm text-gray-500">
              Date:{" "}
              {interview.createdAt
                ? new Date(interview.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-1">Tech Stack:</h4>
          <DisplayTechIcons techStack={interview.techstack} />
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-1">Questions:</h4>
          {Array.isArray(interview.questions) && interview.questions.length > 0 ? (
            <ul className="list-disc ml-6">
              {interview.questions.map((q, i) => (
                <li key={i} className="mb-1 text-gray-700">{q}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No questions found for this interview.</p>
          )}
        </div>
        {feedback && (
          <div className="mt-6 p-4 bg-primary-50 rounded-lg">
            <h4 className="font-semibold mb-2 text-primary-700">
              Feedback Summary
            </h4>
            <p className="mb-2 text-gray-800">{feedback.finalAssessment}</p>
            <div className="flex flex-row gap-4">
              <span className="font-bold text-primary-700">
                Score: {feedback.totalScore}/100
              </span>
              <span className="text-gray-600">
                {feedback.createdAt
                  ? new Date(feedback.createdAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InterviewDetails;
