"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import TestimonialForm from "@/components/TestimonialForm";
import { auth } from "@/firebase/client";
import { User } from "@/types";

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

export default function ReviewsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "Anonymous",
          email: firebaseUser.email || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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

  const handleSubmitSuccess = () => {
    // Refresh testimonials after new one is submitted
    fetchTestimonials();
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-100 mb-4">
            Student Testimonials & Feedback
          </h1>
          <p className="text-lg text-primary-300 max-w-2xl mx-auto">
            Join thousands of candidates who have successfully aced their
            interviews with Prepwise AI. Share your success story and help
            others on their interview journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Feedback Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TestimonialForm
                userId={user?.id}
                userName={user?.name}
                onSubmitSuccess={handleSubmitSuccess}
              />
            </div>
          </div>

          {/* Testimonials Display */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-primary-100 mb-8">
              What Candidates Say
            </h2>
            <div className="flex flex-col gap-6">
              {loading ? (
                <div className="text-center text-primary-300 py-12">
                  <p className="text-lg">Loading testimonials...</p>
                </div>
              ) : testimonials.length === 0 ? (
                <div className="text-center text-primary-300 py-12">
                  <p className="text-lg mb-4">No testimonials yet!</p>
                  <p className="text-sm">
                    Be the first to share your experience and inspire others.
                  </p>
                </div>
              ) : (
                testimonials.map((testimonial, idx) => (
                  <motion.div
                    key={idx}
                    className="rounded-2xl border border-dark-700 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={cardVariants}
                  >
                    {/* Star Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="18"
                          height="18"
                          fill={i < testimonial.rating ? "#FFD600" : "#666"}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <span className="text-primary-300 text-sm">
                        {testimonial.rating}.0/5.0
                      </span>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                        {testimonial.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary-100">
                            {testimonial.userName}
                          </span>
                          {testimonial.verified && (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500">
                              <svg
                                width="12"
                                height="12"
                                fill="none"
                                viewBox="0 0 16 16"
                              >
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
                        <p className="text-xs text-primary-400">
                          {new Date(testimonial.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-primary-200 text-base leading-relaxed">
                      "{testimonial.text}"
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="mt-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to share your success story?
            </h3>
            <p className="text-primary-100 mb-6">
              Sign in to submit your testimonial and help other candidates ace
              their interviews.
            </p>
            <a
              href="/sign-in"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Sign In to Submit Feedback
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
