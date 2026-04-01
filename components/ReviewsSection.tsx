"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Send } from "lucide-react";
import { auth } from "@/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { getDisplayName } from "@/lib/utils/user";

const cardVariants = {
  offscreen: { opacity: 0, y: 60 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      bounce: 0.3,
      duration: 0.8,
    },
  },
};

export default function ReviewsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    userName: "",
    rating: 5,
    text: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTestimonials();
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      // Pre-fill user name if authenticated
      if (firebaseUser) {
        const displayName = getDisplayName(firebaseUser);
        setFormData(prev => ({
          ...prev,
          userName: displayName
        }));
      }
    });
    
    return () => unsubscribe();
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

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userName.trim() || !formData.text.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (formData.text.length < 10 || formData.text.length > 500) {
      alert("Feedback must be between 10 and 500 characters");
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.uid || `guest_${Date.now()}`,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        // Reset form but keep user name
        setFormData(prev => ({
          ...prev,
          rating: 5,
          text: "",
        }));
        setShowFeedbackForm(false);
        
        // Refresh testimonials
        fetchTestimonials();
        
        alert("Thank you for your feedback!");
      } else {
        alert(result.error || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 py-16 px-4 flex flex-col items-center">
      <h2 className="text-4xl font-extrabold mb-2 text-white tracking-tight drop-shadow-lg">
        Student Testimonials
      </h2>
      <p className="text-purple-200 text-lg mb-12 max-w-2xl text-center">
        Real feedback from candidates who aced their interviews with InterviewOrbit
      </p>
      
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl justify-center mb-12">
        {loading ? (
          <div className="text-center text-white py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
            Loading testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center text-purple-200 py-8">
            Be the first to share your experience!
          </div>
        ) : (
          testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="rounded-2xl border border-purple-500/30 bg-white/10 backdrop-blur-md shadow-xl p-8 w-full md:w-1/3 hover:scale-105 hover:shadow-2xl transition-all duration-300 relative"
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
                <span className="font-bold text-lg text-white drop-shadow-sm">
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
              <p className="text-purple-100 text-base leading-relaxed font-medium">
                {testimonial.text}
              </p>
              <p className="text-purple-300 text-xs mt-3">
                {new Date(testimonial.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))
        )}
      </div>

      {/* Feedback Form Section */}
      <div className="w-full max-w-2xl">
        {!showFeedbackForm ? (
          <div className="text-center">
            <Button
              onClick={() => setShowFeedbackForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Share Your Experience
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30 p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Share Your Feedback
            </h3>
            
            {user && (
              <div className="mb-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                <p className="text-purple-200 text-sm">
                  Sharing as <span className="font-semibold text-white">{getDisplayName(user)}</span>
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-colors"
                  placeholder="Enter your name"
                  required
                  readOnly={!!user}
                  disabled={!!user}
                />
                {user && (
                  <p className="text-purple-300 text-xs mt-1">
                    Name is automatically filled from your account
                  </p>
                )}
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-2 transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formData.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-colors resize-none"
                  placeholder="Share your interview experience with InterviewOrbit..."
                  rows={4}
                  minLength={10}
                  maxLength={500}
                  required
                />
                <p className="text-purple-300 text-xs mt-1">
                  {formData.text.length}/500 characters
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => setShowFeedbackForm(false)}
                  variant="outline"
                  className="flex-1 border-purple-600 text-purple-200 hover:bg-purple-900/20"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Submit Feedback
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  );
}
