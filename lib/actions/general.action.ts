"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

// Demo feedback for testing without AI API
const demoFeedback = {
  totalScore: 75,
  categoryScores: [
    { name: "Communication Skills", score: 80, comment: "Good clarity and structured responses. Could improve on conciseness." },
    { name: "Technical Knowledge", score: 70, comment: "Solid understanding of core concepts. Some gaps in advanced topics." },
    { name: "Problem-Solving", score: 75, comment: "Good analytical approach. Could benefit from more examples." },
    { name: "Cultural & Role Fit", score: 80, comment: "Great alignment with team values. Shows enthusiasm." },
    { name: "Confidence & Clarity", score: 70, comment: "Confident delivery. Some hesitation on complex questions." },
  ],
  strengths: ["Clear communication", "Good technical foundation", "Positive attitude", "Structured responses"],
  areasForImprovement: ["Provide more specific examples", "Elaborate on technical details", "Reduce filler words", "Prepare for edge case questions"],
  finalAssessment: "The candidate shows strong potential with good communication skills and technical knowledge. With some practice on providing detailed examples and handling complex scenarios, they would be a great fit for the role.",
};

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    // Check if we should use demo mode (when AI quota is exhausted)
    const useDemoMode = !process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.DEMO_MODE === "true";
    
    let object;
    
    if (useDemoMode) {
      console.log("Using demo feedback mode");
      object = demoFeedback;
    } else {
      const formattedTranscript = transcript
        .map(
          (sentence: { role: string; content: string }) =>
            `- ${sentence.role}: ${sentence.content}\n`
        )
        .join("");

      const result = await generateObject({
        model: google("gemini-2.0-flash-001"),
        maxRetries: 0, // Disable retries to prevent quota waste
        schema: feedbackSchema,
        prompt: `
          You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
          Transcript:
          ${formattedTranscript}

          Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
          - **Communication Skills**: Clarity, articulation, structured responses.
          - **Technical Knowledge**: Understanding of key concepts for the role.
          - **Problem-Solving**: Ability to analyze problems and propose solutions.
          - **Cultural & Role Fit**: Alignment with company values and job role.
          - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
          `,
        system:
          "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
      });
      
      object = result.object;
    }

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;
  if (!userId) return [];
  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string | undefined
): Promise<Interview[] | null> {
  if (!userId) return [];
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}
