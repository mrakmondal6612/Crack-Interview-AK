import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { getCurrentUser } from '@/lib/actions/auth.action';
import { demoQuestions } from "@/constants";

export async function POST(request: Request) {
  try {
    const { type, role, level, techstack, amount, demoMode } = await request.json();
    
    console.log("DEMO_MODE env var:", process.env.DEMO_MODE);
    console.log("demoMode from request:", demoMode);
    
    // Validate required fields
    if (!role || !level || !techstack || !type || !amount) {
      return Response.json({ 
        success: false, 
        error: 'Missing required fields: role, level, techstack, type, amount' 
      }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    let parsedQuestions: string[];

    // Demo mode: bypass AI API and use pre-generated questions
    // Always use demo mode if DEMO_MODE environment variable is set
    if (process.env.DEMO_MODE === "true" || demoMode) {
      console.log("Using demo mode for interview generation");
      // Shuffle demo questions and take requested amount
      const shuffled = [...demoQuestions].sort(() => 0.5 - Math.random());
      parsedQuestions = shuffled.slice(0, Math.min(amount, demoQuestions.length));
    } else {
      // Check if Google AI API key is configured
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
        return Response.json({ 
          success: false, 
          error: 'AI service not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY or enable demo mode.' 
        }, { status: 500 });
      }

      const { text: questions } = await generateText({
        model: google("gemini-2.0-flash-001"),
        maxRetries: 0, // Disable retries to prevent multiple API calls on quota errors
        prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        Thank you! <3
    `,
      });

      try {
        parsedQuestions = JSON.parse(questions);
        if (!Array.isArray(parsedQuestions)) {
          throw new Error("Questions is not an array");
        }
      } catch (parseError) {
        console.error("Failed to parse questions:", questions);
        // Fallback: split by newlines and clean up
        parsedQuestions = questions
          .split(/\n/)
          .map(q => q.replace(/^\s*[-*]\s*/, '').trim())
          .filter(q => q.length > 0);
      }
    }

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(",").map((t: string) => t.trim()).filter((t: string) => t),
      questions: parsedQuestions,
      userId: user.id,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);
    return Response.json({ success: true, id: docRef.id }, { status: 200 });
  } catch (error) {
    console.error("Error generating interview:", error);
    
    // Check for rate limit / quota errors
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const isQuotaError = errorMessage.includes("quota") || errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED");
    const isRateLimit = errorMessage.includes("rate limit") || errorMessage.includes("Quota exceeded");
    
    if (isQuotaError || isRateLimit) {
      return Response.json({ 
        success: false, 
        error: "AI service quota exceeded. Please try again in 1 minute, or upgrade your Google AI API plan at https://ai.google.dev/" 
      }, { status: 429 });
    }
    
    return Response.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
