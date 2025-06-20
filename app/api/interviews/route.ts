import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ interviews: [] }, { status: 400 });
  }
  try {
    // Fetch interviews for the user from Firestore
    const snapshot = await db.collection("interviews").where("userId", "==", userId).get();
    const interviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ interviews });
  } catch (error) {
    return NextResponse.json({ interviews: [], error: error.message }, { status: 500 });
  }
}
