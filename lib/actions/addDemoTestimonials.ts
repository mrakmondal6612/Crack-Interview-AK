import { db } from "@/firebase/admin";

async function addDemoTestimonials() {
  const now = new Date().toISOString();

  const demoTestimonials = [
    {
      userId: "user_demo_1",
      userName: "Sarah Johnson",
      rating: 5,
      text: "Prepwise completely transformed how I approach interviews. The AI feedback was incredibly detailed and helped me identify my weaknesses. I got offers from 3 top tech companies!",
      verified: true,
      createdAt: now,
    },
    {
      userId: "user_demo_2",
      userName: "Amit Patel",
      rating: 5,
      text: "The mock interviews felt so real. Practicing with Prepwise's AI interviewer made me confident and calm during actual interviews. Highly recommend to anyone preparing for tech roles.",
      verified: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      userId: "user_demo_3",
      userName: "Emma Chen",
      rating: 4,
      text: "Great platform for interview prep. The biggest advantage is that you can practice anytime, anywhere. Wish there were more company-specific interview scenarios though.",
      verified: true,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      userId: "user_demo_4",
      userName: "Michael Rodriguez",
      rating: 5,
      text: "From struggling with behavioral questions to nailing them - Prepwise made all the difference. The detailed feedback after each practice session was gold. Worth every penny!",
      verified: true,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      userId: "user_demo_5",
      userName: "Lisa Wang",
      rating: 4,
      text: "The interview experience is surprisingly realistic. I appreciate the immediate feedback on communication skills and technical explanations. Helped me land my dream role at Google!",
      verified: true,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      userId: "user_demo_6",
      userName: "James Thompson",
      rating: 5,
      text: "Finally, a platform that truly simulates real interviews. The AI doesn't just ask questions - it challenges your thinking and helps you improve on the spot. Changed my career trajectory!",
      verified: true,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      userId: "user_demo_7",
      userName: "Priya Verma",
      rating: 5,
      text: "As a career changer, I was nervous about technical interviews. Prepwise gave me the practice and confidence I needed. Passed all interviews at my target companies!",
      verified: true,
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      userId: "user_demo_8",
      userName: "David Kim",
      rating: 4,
      text: "The platform is user-friendly and the interview questions are well-curated. The only improvement would be more industry-specific questions. Overall, excellent resource!",
      verified: true,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  for (const testimonial of demoTestimonials) {
    await db.collection("testimonials").add(testimonial);
  }

  console.log(`✅ Added ${demoTestimonials.length} demo testimonials`);
  return { success: true, count: demoTestimonials.length };
}

// Run the script
addDemoTestimonials()
  .then((result) => {
    console.log("Success:", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
