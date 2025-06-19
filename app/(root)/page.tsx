import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import InterviewCard from "@/components/InterviewCard";

async function Home() {
  const user = await getCurrentUser();
  const userId = user?.uid || user?.id;
  let userInterviews = [];
  if (userId) {
    userInterviews = await getInterviewsByUserId(userId);
  }

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
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
      {userInterviews && userInterviews.length > 0 && (
        <section className="flex flex-col gap-6 mt-8">
          <h2>Your Interviews</h2>
          <div className="interviews-section flex flex-wrap gap-6">
            {userInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                userId={userId}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                userName={user?.name}
                userPhotoUrl={user?.profileURL}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Home;
