"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export default function RetakeInterviewButton({ interviewId, userId }: { interviewId: string, userId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleRetake() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/clone-interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interviewId, userId })
        });
        const data = await res.json();
        if (res.ok && data.newInterviewId) {
          router.push(`/interview/${data.newInterviewId}/call`);
        } else {
          // Optionally handle error (e.g., show toast)
        }
      } catch (error) {
        // Optionally handle error (e.g., show toast)
      }
    });
  }

  return (
    <Button className="btn-secondary mt-2" onClick={handleRetake} disabled={isPending}>
      {isPending ? "Preparing..." : "Give Interview"}
    </Button>
  );
}
