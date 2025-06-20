"use client";
import { useState, useMemo } from "react";
import InterviewCard from "@/components/InterviewCard";
import { Interview } from "@/types";

export default function AllInterviewsClient({
  interviews = [],
  userId = "",
  userName = "",
  userPhotoUrl = ""
}: {
  interviews: Interview[];
  userId: string;
  userName: string;
  userPhotoUrl: string;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    let result = interviews;
    if (filter === "my") result = result.filter(i => i.userId === userId);
    if (filter === "demo") result = result.filter(i => i.userId !== userId);
    if (filter === "technical") result = result.filter(i => /tech/i.test(i.type));
    if (filter === "behavioral") result = result.filter(i => /behav/i.test(i.type));
    if (search) {
      result = result.filter(i =>
        i.role.toLowerCase().includes(search.toLowerCase()) ||
        i.techstack.join(",").toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
  }, [interviews, userId, filter, search]);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by role or tech..."
          className="px-3 py-2 rounded bg-dark-800 text-primary-100 border border-dark-700 w-full max-w-xs"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className={`px-3 py-2 rounded ${filter==="all"?"bg-primary-700":"bg-dark-700"} text-primary-100`} onClick={()=>setFilter("all")}>All</button>
        <button className={`px-3 py-2 rounded ${filter==="my"?"bg-primary-700":"bg-dark-700"} text-primary-100`} onClick={()=>setFilter("my")}>My Interviews</button>
        <button className={`px-3 py-2 rounded ${filter==="demo"?"bg-primary-700":"bg-dark-700"} text-primary-100`} onClick={()=>setFilter("demo")}>Demo</button>
        <button className={`px-3 py-2 rounded ${filter==="technical"?"bg-primary-700":"bg-dark-700"} text-primary-100`} onClick={()=>setFilter("technical")}>Technical</button>
        <button className={`px-3 py-2 rounded ${filter==="behavioral"?"bg-primary-700":"bg-dark-700"} text-primary-100`} onClick={()=>setFilter("behavioral")}>Behavioral</button>
      </div>
      <div className="flex flex-wrap gap-6 justify-center">
        {filtered.length > 0 ? (
          filtered.map((interview) => (
            <InterviewCard
              key={interview.id}
              interviewId={interview.id}
              userId={interview.userId}
              role={interview.role}
              type={interview.type}
              techstack={interview.techstack}
              createdAt={interview.createdAt}
              candidateName={interview.candidateName}
              candidatePhotoUrl={interview.candidatePhotoUrl}
            />
          ))
        ) : (
          <p className="text-primary-200">No interviews found.</p>
        )}
      </div>
    </>
  );
}
