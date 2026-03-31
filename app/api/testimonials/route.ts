import { db } from "@/firebase/admin";
import { auth } from "@/firebase/client";

export async function POST(request: Request) {
  try {
    const { userId, userName, rating, text } = await request.json();

    if (!userId || !userName || !rating || !text) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
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
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create testimonial" }),
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
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
    console.error("Error fetching testimonials:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch testimonials" }),
      { status: 500 }
    );
  }
}
