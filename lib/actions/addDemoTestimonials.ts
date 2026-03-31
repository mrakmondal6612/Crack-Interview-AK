async function addDemoTestimonials() {
  const demoTestimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      feedback:
        "Prepwise completely transformed how I approach interviews. The AI feedback was incredibly detailed and helped me identify my weaknesses. I got offers from 3 top tech companies!",
    },
    {
      name: "Amit Patel",
      rating: 5,
      feedback:
        "The mock interviews felt so real. Practicing with Prepwise's AI interviewer made me confident and calm during actual interviews. Highly recommend to anyone preparing for tech roles.",
    },
    {
      name: "Emma Chen",
      rating: 4,
      feedback:
        "Great platform for interview prep. The biggest advantage is that you can practice anytime, anywhere. Wish there were more company-specific interview scenarios though.",
    },
    {
      name: "Michael Rodriguez",
      rating: 5,
      feedback:
        "From struggling with behavioral questions to nailing them - Prepwise made all the difference. The detailed feedback after each practice session was gold. Worth every penny!",
    },
    {
      name: "Lisa Wang",
      rating: 4,
      feedback:
        "The interview experience is surprisingly realistic. I appreciate the immediate feedback on communication skills and technical explanations. Helped me land my dream role at Google!",
    },
    {
      name: "James Thompson",
      rating: 5,
      feedback:
        "Finally, a platform that truly simulates real interviews. The AI doesn't just ask questions - it challenges your thinking and helps you improve on the spot. Changed my career trajectory!",
    },
    {
      name: "Priya Verma",
      rating: 5,
      feedback:
        "As a career changer, I was nervous about technical interviews. Prepwise gave me the practice and confidence I needed. Passed all interviews at my target companies!",
    },
    {
      name: "David Kim",
      rating: 4,
      feedback:
        "The platform is user-friendly and the interview questions are well-curated. The only improvement would be more industry-specific questions. Overall, excellent resource!",
    },
    {
      name: "Ravi Kumar",
      rating: 5,
      feedback:
        "Outstanding platform! I improved my interview skills significantly within 2 weeks. The real-time feedback and personalized tips were exactly what I needed to crack my interviews.",
    },
    {
      name: "Jessica Anderson",
      rating: 5,
      feedback:
        "Prepwise's AI interviewer is incredibly smart and adaptive. You feel like you're in a real interview room. The tips after each session helped me overcome my anxiety about tech interviews.",
    },
    {
      name: "Naveen Singh",
      rating: 4,
      feedback:
        "Excellent mock interview platform. The questions are relevant and challenging. Would love to see more live feedback during interviews, but overall very impressed!",
    },
    {
      name: "Sophie Martin",
      rating: 5,
      feedback:
        "I was barely passing phone screens before Prepwise. Now I'm crushing them! The platform helped me understand what interviewers actually look for. Highly recommended!",
    },
  ];

  console.log(`Adding ${demoTestimonials.length} demo testimonials...`);

  for (const testimonial of demoTestimonials) {
    try {
      const response = await fetch("http://localhost:3001/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testimonial),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(
          `❌ Error adding testimonial from ${testimonial.name}:`,
          errorData
        );
        continue;
      }

      const result = await response.json();
      console.log(`✅ Added testimonial from ${testimonial.name}`);
    } catch (error) {
      console.error(
        `❌ Error adding testimonial from ${testimonial.name}:`,
        error
      );
    }
  }

  console.log(
    `\n✅ Successfully added ${demoTestimonials.length} demo testimonials!`
  );
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
