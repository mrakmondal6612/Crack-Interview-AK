import { db } from "@/firebase/admin";
import demoTestimonials from "@/public/demo-testimonials.json";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Support both formats: (userId, userName, rating, text) and (name, rating, feedback)
    const userId =
      body.userId ||
      `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userName = body.userName || body.name;
    const rating = body.rating;
    const text = body.text || body.feedback;

    if (!userName || !rating || !text) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields (name, rating, feedback)",
        }),
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: "Rating must be between 1 and 5" }),
        { status: 400 }
      );
    }

    if (text.length < 10 || text.length > 500) {
      return new Response(
        JSON.stringify({
          error: "Feedback must be between 10 and 500 characters",
        }),
        { status: 400 }
      );
    }

    // If Firebase is not initialized, just acknowledge the submission
    if (!db) {
      console.log("Firebase not initialized. Testimonial not stored:", {
        userName,
        rating,
      });
      return new Response(
        JSON.stringify({
          success: true,
          message:
            "Feedback received! Please configure Firebase to save testimonials.",
          id: `temp_${Date.now()}`,
        }),
        { status: 201 }
      );
    }

    try {
      const testimonialRef = db.collection("testimonials").doc();

      await testimonialRef.set({
        userId,
        userName,
        rating,
        text,
        verified: true,
        createdAt: new Date().toISOString(),
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Testimonial submitted successfully",
          id: testimonialRef.id,
        }),
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }
  } catch (error) {
    console.error("Error creating testimonial:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "Failed to create testimonial",
        details: errorMessage,
      }),
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // If Firebase is not initialized, return demo testimonials immediately
    if (!db) {
      console.log("Firebase not initialized. Returning demo testimonials.");
      return new Response(JSON.stringify({ testimonials: demoTestimonials }), {
        status: 200,
      });
    }

    const snapshot = await db
      .collection("testimonials")
      .orderBy("createdAt", "desc")
      .limit(6)
      .get();

    const testimonials: Testimonial[] = [];
    snapshot.forEach((doc) => {
      testimonials.push({
        id: doc.id,
        ...doc.data(),
      } as Testimonial);
    });

    return new Response(JSON.stringify({ testimonials }), { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonials from Firestore:", error);

    // Fallback to demo testimonials
    return new Response(JSON.stringify({ testimonials: demoTestimonials }), {
      status: 200,
    });
  }
}
