import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById, getFeedbackByInterviewId } from "@/lib/actions/general.action";
import Agent from "@/components/Agent";
import { redirect } from "next/navigation";

const InterviewCall = async ({ params }: { params: { id: string } }) => {
  const user = await getCurrentUser();
  const interview = await getInterviewById(params.id);
  if (!interview) redirect("/");
  const feedback = await getFeedbackByInterviewId({
    interviewId: params.id,
    userId: user?.id!,
  });

  return (
    <Agent
      userName={user?.name!}
      userId={user?.id}
      interviewId={params.id}
      type="interview"
      questions={interview.questions}
      feedbackId={feedback?.id}
    />
  );
};

export default InterviewCall;
