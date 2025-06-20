import { getCurrentUser } from "@/lib/actions/auth.action";
import AllInterviewsClientWrapper from "@/components/AllInterviewsClientWrapper";

const Page = async () => {
  // Fetch all interviews from API
  const user = await getCurrentUser();
  const userId = user?.id || "";
  let allCards: any[] = [];
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/interviews`, { cache: "no-store" });
    const data = await res.json();
    allCards = data.interviews || [];
  } catch (e) {
    allCards = [];
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <h1 className="text-3xl font-bold text-primary-100 mb-4">All Interviews</h1>
      {/* Stats Section */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="bg-dark-800 text-primary-100 rounded-lg px-4 py-2">
          Total Interviews: {allCards.length}
        </div>
        <div className="bg-dark-800 text-primary-100 rounded-lg px-4 py-2">
          My Interviews: {allCards.filter(i => i.userId === userId).length}
        </div>
      </div>
      <AllInterviewsClientWrapper
        interviews={allCards}
        userId={userId}
        userName={user?.name || ""}
        userPhotoUrl={user?.profileURL || ""}
      />
    </div>
  );
};

export default Page;
