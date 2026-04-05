"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Send, Edit2, Trash2 } from "lucide-react";
import { auth } from "@/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { getDisplayName } from "@/lib/utils/user";
import { Testimonial } from "@/types";

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
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    rating: 5,
    text: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [userTestimonial, setUserTestimonial] = useState<Testimonial | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
        // Fetch user's testimonial
        fetchUserTestimonial(firebaseUser.uid);
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

  const fetchUserTestimonial = async (userId: string) => {
    try {
      const response = await fetch(`/api/testimonials?userId=${userId}`);
      const data = await response.json();
      if (data.testimonial) {
        setUserTestimonial(data.testimonial);
      } else {
        setUserTestimonial(null);
      }
    } catch (error) {
      console.error("Error fetching user testimonial:", error);
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
      const userId = user?.uid || `guest_${Date.now()}`;
      
      if (isEditing && editingId) {
        // Update existing testimonial
        const response = await fetch("/api/testimonials", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingId,
            userId,
            rating: formData.rating,
            text: formData.text,
          }),
        });

        const result = await response.json();
        
        if (response.ok) {
          alert("Feedback updated successfully!");
          setIsEditing(false);
          setEditingId(null);
          
          // Refresh user testimonial and all testimonials
          await fetchUserTestimonial(userId);
          fetchTestimonials();
          
          setShowFeedbackForm(false);
        } else {
          alert(result.error || "Failed to update feedback");
        }
      } else {
        // Create new testimonial
        const response = await fetch("/api/testimonials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userId,
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
          
          // Refresh user testimonial and all testimonials
          await fetchUserTestimonial(userId);
          fetchTestimonials();
          
          alert("Thank you for your feedback!");
        } else {
          if (response.status === 409) {
            // User already has a testimonial
            alert(result.error || "You have already submitted a testimonial.");
            await fetchUserTestimonial(userId);
          } else {
            alert(result.error || "Failed to submit feedback");
          }
        }
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setFormData({
      userName: testimonial.userName,
      rating: testimonial.rating,
      text: testimonial.text,
    });
    setEditingId(testimonial.id);
    setIsEditing(true);
    setShowFeedbackForm(true);
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    if (!confirm("Are you sure you want to delete your testimonial?")) {
      return;
    }

    const userId = user?.uid;
    if (!userId) {
      alert("You must be logged in to delete your testimonial");
      return;
    }

    try {
      const response = await fetch(`/api/testimonials?id=${testimonialId}&userId=${userId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      
      if (response.ok) {
        alert("Testimonial deleted successfully");
        setUserTestimonial(null);
        fetchTestimonials();
      } else {
        alert(result.error || "Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Failed to delete testimonial. Please try again.");
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-purple-200 text-sm font-medium">Student Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Students
            </span>{" "}
            Say
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto">
            Real experiences from candidates who transformed their interview skills and landed their dream jobs
          </p>
        </div>
        
        <div className="mb-12 sm:mb-16">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-400"></div>
                <span className="text-lg">Loading amazing stories...</span>
              </div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Be the First!</h3>
                <p className="text-gray-400">Share your interview success story and inspire others.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile: Show only 2-3 cards */}
              <div className="sm:hidden">
                <div className="grid grid-cols-1 gap-6 mb-8">
                  {testimonials.slice(0, 3).map((testimonial, idx) => (
                    <motion.div
                      key={idx}
                      className="group relative"
                      initial="offscreen"
                      whileInView="onscreen"
                      viewport={{ once: true, amount: 0.3 }}
                      variants={cardVariants}
                    >
                      <div className="relative h-full p-6 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Quote icon decoration */}
                        <div className="absolute top-4 right-4 w-8 h-8 text-purple-500/20">
                          <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.995 3.638-3.995 5.849h3.983v10h-9.984z"/>
                          </svg>
                        </div>
                        
                        <div className="relative z-10">
                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < testimonial.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          
                          {/* User info */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {testimonial.userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-white text-base">
                                  {testimonial.userName}
                                </h3>
                                {testimonial.verified && (
                                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg width="12" height="12" fill="white" viewBox="0 0 16 16">
                                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-400 text-xs">
                                {new Date(testimonial.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                          
                          {/* Testimonial text */}
                          <p className="text-gray-200 text-sm leading-relaxed mb-4 line-clamp-3">
                            "{testimonial.text}"
                          </p>
                          
                          {/* Edit/Delete buttons for user's own testimonial */}
                          {user && testimonial.userId === user.uid && (
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleEditTestimonial(testimonial)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-xs font-medium transition-colors"
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTestimonial(testimonial.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg text-xs font-medium transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* View All Button for Mobile */}
                {testimonials.length > 3 && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowAllTestimonials(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-purple-600/25"
                    >
                      View All {testimonials.length} Stories
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop/Tablet: Show all cards in grid */}
              <div className="hidden sm:block">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {testimonials.map((testimonial, idx) => (
                    <motion.div
                      key={idx}
                      className="group relative"
                      initial="offscreen"
                      whileInView="onscreen"
                      viewport={{ once: true, amount: 0.3 }}
                      variants={cardVariants}
                    >
                      <div className="relative h-full p-6 sm:p-8 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Quote icon decoration */}
                        <div className="absolute top-4 right-4 w-8 h-8 text-purple-500/20">
                          <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.995 3.638-3.995 5.849h3.983v10h-9.984z"/>
                          </svg>
                        </div>
                        
                        <div className="relative z-10">
                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                  i < testimonial.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          
                          {/* User info */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                              {testimonial.userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-white text-base sm:text-lg">
                                  {testimonial.userName}
                                </h3>
                                {testimonial.verified && (
                                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg width="12" height="12" fill="white" viewBox="0 0 16 16">
                                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-400 text-xs sm:text-sm">
                                {new Date(testimonial.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                          
                          {/* Testimonial text */}
                          <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-4 line-clamp-4">
                            "{testimonial.text}"
                          </p>
                          
                          {/* Read more indicator for long text */}
                          {testimonial.text.length > 150 && (
                            <div className="text-purple-400 text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Read full story →
                            </div>
                          )}
                          
                          {/* Edit/Delete buttons for user's own testimonial */}
                          {user && testimonial.userId === user.uid && (
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleEditTestimonial(testimonial)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-xs font-medium transition-colors"
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTestimonial(testimonial.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg text-xs font-medium transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Feedback Form Section */}
        <div className="max-w-2xl mx-auto">
          {/* Show user's testimonial if exists */}
          {userTestimonial && !showFeedbackForm && (
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl border border-green-500/30 p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">You've Already Shared Your Story!</h3>
                <p className="text-gray-300 mb-6">
                  Thank you for your feedback. You can edit or delete your testimonial anytime.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => handleEditTestimonial(userTestimonial)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-purple-600/25"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Your Feedback
                  </Button>
                  <Button
                    onClick={() => handleDeleteTestimonial(userTestimonial.id)}
                    variant="outline"
                    className="border-red-500/50 text-red-300 hover:bg-red-600/20 px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {!showFeedbackForm && !userTestimonial ? (
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Share Your Success Story</h3>
                <p className="text-gray-300 mb-6">
                  Help others by sharing your interview experience and how InterviewOrbit helped you succeed
                </p>
                <Button
                  onClick={() => setShowFeedbackForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-purple-600/25"
                >
                  Share Your Experience
                </Button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {isEditing ? "Edit Your Feedback" : "Share Your Feedback"}
              </h3>
              
              {user && (
                <div className="mb-6 p-4 bg-purple-900/30 rounded-xl border border-purple-500/30">
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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-colors"
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
                        className="p-2 transition-colors hover:scale-110"
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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-colors resize-none"
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

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    onClick={() => setShowFeedbackForm(false)}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        {isEditing ? "Updating..." : "Submitting..."}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        {isEditing ? "Update Feedback" : "Submit Feedback"}
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Modal for All Testimonials */}
      {showAllTestimonials && (
        <div className="sm:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">All Success Stories</h3>
                <button
                  onClick={() => setShowAllTestimonials(false)}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-1 gap-4">
                {testimonials.map((testimonial, idx) => (
                  <motion.div
                    key={idx}
                    className="group relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="relative p-4 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < testimonial.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      
                      {/* User info */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {testimonial.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white text-sm">
                              {testimonial.userName}
                            </h4>
                            {testimonial.verified && (
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <svg width="10" height="10" fill="white" viewBox="0 0 16 16">
                                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs">
                            {new Date(testimonial.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Testimonial text */}
                      <p className="text-gray-200 text-xs leading-relaxed">
                        "{testimonial.text}"
                      </p>
                      
                      {/* Edit/Delete buttons for user's own testimonial */}
                      {user && testimonial.userId === user.uid && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEditTestimonial(testimonial)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(testimonial.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
