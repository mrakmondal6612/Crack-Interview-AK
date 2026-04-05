import { db } from "@/firebase/admin";
import demoTestimonials from "@/public/demo-testimonials.json";
import { Testimonial } from "@/types";

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
      // Check if user already has a testimonial
      const existingTestimonial = await db
        .collection("testimonials")
        .where("userId", "==", userId)
        .limit(1)
        .get();

      if (!existingTestimonial.empty) {
        return new Response(
          JSON.stringify({
            error: "You have already submitted a testimonial. You can edit or delete your existing testimonial.",
            existingId: existingTestimonial.docs[0].id,
          }),
          { status: 409 }
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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // If Firebase is not initialized, return demo testimonials immediately
    if (!db) {
      if (userId) {
        const userTestimonial = demoTestimonials.find((t: any) => t.userId === userId);
        return new Response(JSON.stringify({ testimonial: userTestimonial || null }), {
          status: 200,
        });
      }
      return new Response(JSON.stringify({ testimonials: demoTestimonials }), {
        status: 200,
      });
    }

    // If userId is provided, get user's testimonial
    if (userId) {
      const snapshot = await db
        .collection("testimonials")
        .where("userId", "==", userId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return new Response(JSON.stringify({ testimonial: null }), { status: 200 });
      }

      const testimonial = {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data(),
      } as Testimonial;

      return new Response(JSON.stringify({ testimonial }), { status: 200 });
    }

    // Otherwise, get all testimonials
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
    // Fallback to demo testimonials
    return new Response(JSON.stringify({ testimonials: demoTestimonials }), {
      status: 200,
    });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, userId, rating, text } = body;

    if (!id || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields (id, userId)" }),
        { status: 400 }
      );
    }

    if (!db) {
      return new Response(
        JSON.stringify({ error: "Firebase not initialized" }),
        { status: 500 }
      );
    }

    // Check if testimonial exists and belongs to the user
    const testimonialRef = db.collection("testimonials").doc(id);
    const doc = await testimonialRef.get();

    if (!doc.exists) {
      return new Response(
        JSON.stringify({ error: "Testimonial not found" }),
        { status: 404 }
      );
    }

    const testimonialData = doc.data();
    if (testimonialData?.userId !== userId) {
      return new Response(
        JSON.stringify({ error: "You can only edit your own testimonial" }),
        { status: 403 }
      );
    }

    // Update only provided fields
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return new Response(
          JSON.stringify({ error: "Rating must be between 1 and 5" }),
          { status: 400 }
        );
      }
      updateData.rating = rating;
    }

    if (text !== undefined) {
      if (text.length < 10 || text.length > 500) {
        return new Response(
          JSON.stringify({
            error: "Feedback must be between 10 and 500 characters",
          }),
          { status: 400 }
        );
      }
      updateData.text = text;
    }

    await testimonialRef.update(updateData);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Testimonial updated successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating testimonial:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "Failed to update testimonial",
        details: errorMessage,
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters (id, userId)" }),
        { status: 400 }
      );
    }

    if (!db) {
      return new Response(
        JSON.stringify({ error: "Firebase not initialized" }),
        { status: 500 }
      );
    }

    // Check if testimonial exists and belongs to the user
    const testimonialRef = db.collection("testimonials").doc(id);
    const doc = await testimonialRef.get();

    if (!doc.exists) {
      return new Response(
        JSON.stringify({ error: "Testimonial not found" }),
        { status: 404 }
      );
    }

    const testimonialData = doc.data();
    if (testimonialData?.userId !== userId) {
      return new Response(
        JSON.stringify({ error: "You can only delete your own testimonial" }),
        { status: 403 }
      );
    }

    await testimonialRef.delete();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Testimonial deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "Failed to delete testimonial",
        details: errorMessage,
      }),
      { status: 500 }
    );
  }
}
