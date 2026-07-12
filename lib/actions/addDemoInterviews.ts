

import { db } from "@/firebase/admin";

import { getCurrentUser } from '@/lib/actions/auth.action';

export async function addDemoInterviews() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const userId = user.id;
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

  if (!db) throw new Error("Firebase not initialized");

  for (const interview of demoInterviews) {
    await db.collection("interviews").add(interview);
  }

  return { success: true };
}
