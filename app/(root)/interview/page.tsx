import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";
import AllInterviewsClientWrapper from "@/components/AllInterviewsClientWrapper";

const Page = async () => {
  // Fetch user and interviews in parallel for speed
  const [user, userInterviews, allInterview] = await Promise.all([
    getCurrentUser(),
    getCurrentUser().then(u => u?.id ? getInterviewsByUserId(u.id) : []),
    getCurrentUser().then(u => u?.id ? getLatestInterviews({ userId: u.id, limit: 20 }) : []),
  ]);
  const userId = user?.id;
  const allCards = [
    ...(userInterviews || []),
    ...(allInterview?.filter(i => !userInterviews?.some(u => u.id === i.id)) || [])
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <h1 className="text-3xl font-bold text-primary-100 mb-4">All Interviews</h1>
      {/* Stats Section */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="bg-dark-800 text-primary-100 rounded-lg px-4 py-2">
          Total Interviews: {allCards.length}
        </div>
        <div className="bg-dark-800 text-primary-100 rounded-lg px-4 py-2">
          My Interviews: {(userInterviews?.length || 0)}
        </div>
      </div>
      <AllInterviewsClientWrapper
        interviews={allCards}
        userId={userId || ""}
        userName={user?.name || ""}
        userPhotoUrl={user?.profileURL || ""}
      />
    </div>
  );
};

export default Page;
