import { db } from "@/firebase/admin";
import { getInterviewById } from "@/lib/actions/general.action";

export async function cloneInterview(originalInterviewId: string, userId: string) {
  const original = await getInterviewById(originalInterviewId);
  if (!original) throw new Error("Original interview not found");

  // Remove id and createdAt, set new createdAt
  const { id, createdAt, ...rest } = original;
  const newInterview = {
    ...rest,
    userId,
    createdAt: new Date().toISOString(),
    finalized: false,
  };
  const docRef = await db.collection("interviews").add(newInterview);
  return docRef.id;
}
