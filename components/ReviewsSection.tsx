"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const cardVariants = {
  offscreen: { opacity: 0, y: 60 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 0.8,
    },
  },
};

export default function ReviewsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials");
      const data = await response.json();
      if (data.testimonials) {
        setTestimonials(data.testimonials);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-primary-50 to-primary-100 py-16 px-4 flex flex-col items-center">
      <h2 className="text-4xl font-extrabold mb-2 text-primary-900 tracking-tight drop-shadow-lg">
        Student Testimonials
      </h2>
      <p className="text-primary-700 text-lg mb-12 max-w-2xl text-center">
        Real feedback from candidates who aced their interviews with Prepwise
      </p>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl justify-center">
        {loading ? (
          <div className="text-center text-primary-900 py-8">
            Loading testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center text-primary-900 py-8">
            Be the first to share your experience!
          </div>
        ) : (
          testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="rounded-2xl border border-dark-700 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 shadow-xl p-8 w-full md:w-1/3 hover:scale-105 hover:shadow-2xl transition-all duration-300 relative"
              style={{ minHeight: 220 }}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.4 }}
              variants={cardVariants}
            >
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="22"
                    height="22"
                    fill={i < testimonial.rating ? "#FFD600" : "#666"}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-lg text-primary-100 drop-shadow-sm">
                  {testimonial.userName}
                </span>
                {testimonial.verified && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold">
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="8" fill="#22C55E" />
                      <path
                        d="M5 8.5l2 2 4-4"
                        stroke="#fff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </div>
              <p className="text-primary-200 text-base leading-relaxed font-medium">
                {testimonial.text}
              </p>
              <p className="text-primary-400 text-xs mt-3">
                {new Date(testimonial.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
