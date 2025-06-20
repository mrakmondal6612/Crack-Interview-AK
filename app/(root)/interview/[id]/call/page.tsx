import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById, getFeedbackByInterviewId } from "@/lib/actions/general.action";
import Agent from "@/components/Agent";
import { redirect } from "next/navigation";

const InterviewCall = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);
  if (!interview) redirect("/");
  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  // Only show user photo if the logged-in user is the interview creator
  const showUserPhoto = user?.id === interview.userId;
  const userName = user?.name || "Candidate";
  const userPhotoUrl = showUserPhoto ? user?.profileURL : undefined;

  return (
    <Agent
      userName={userName}
      userId={user?.id}
      interviewId={id}
      type="interview"
      questions={interview.questions}
      feedbackId={feedback?.id}
      userPhotoUrl={userPhotoUrl}
    />
  );
};

export default InterviewCall;
