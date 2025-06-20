import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // If userId is provided, filter by user, else return all interviews
  const userId = searchParams.get("userId");
  try {
    let query = db.collection("interviews");
    if (userId) {
      query = query.where("userId", "==", userId);
    }
    const snapshot = await query.get();
    const interviews = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        // Fetch user info for each interview
        const userDoc = await db.collection("users").doc(data.userId).get();
        const userData = userDoc.exists ? userDoc.data() : {};
        return {
          id: doc.id,
          ...data,
          candidateName: userData?.name || "User",
          candidatePhotoUrl: userData?.profileURL || undefined,
        };
      })
    );
    return NextResponse.json({ interviews });
  } catch (error) {
    return NextResponse.json({ interviews: [], error: String(error) }, { status: 500 });
  }
}
