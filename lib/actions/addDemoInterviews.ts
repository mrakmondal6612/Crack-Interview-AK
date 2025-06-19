import { db } from "@/firebase/admin";

// Replace with your actual Firebase user id
const DEMO_USER_ID = "clfPR7lNOgOHk6RFjJFc2mMcQeI3";

export async function addDemoInterviews() {
  // const user = await getCurrentUser();
  // if (!user) throw new Error("Not authenticated");
  // const userId = user.uid || user.id;
  const userId = DEMO_USER_ID;
  const now = new Date().toISOString();

  const demoInterviews = [
    {
      role: "Backend Developer",
      type: "Technical",
      techstack: ["Node.js", "Express", "MongoDB"],
      userId,
      createdAt: now,
      finalized: true,
    },
    {
      role: "Full Stack Developer",
      type: "Technical",
      techstack: ["React", "Node.js", "PostgreSQL"],
      userId,
      createdAt: now,
      finalized: true,
    },
    {
      role: "Android Developer",
      type: "Technical",
      techstack: ["Kotlin", "Android Studio", "Firebase"],
      userId,
      createdAt: now,
      finalized: true,
    },
  ];

  for (const interview of demoInterviews) {
    await db.collection("interviews").add(interview);
  }

  return { success: true };
}
