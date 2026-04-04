"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TestimonialFormProps {
  userId?: string;
  userName?: string;
  onSubmitSuccess?: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({
  userId,
  userName,
  onSubmitSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [formName, setFormName] = useState(userName || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Please write your feedback");
      return;
    }

    if (text.length < 10) {
      toast.error("Feedback must be at least 10 characters");
      return;
    }

    if (!formName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || "anonymous",
          userName: formName,
          rating,
          text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to submit feedback");
        return;
      }

      toast.success("Thank you for your feedback!");
      setText("");
      setFormName(userName || "");
      setRating(5);

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 rounded-2xl p-8 shadow-xl border border-dark-700">
      <h2 className="text-2xl font-bold text-primary-100 mb-6">
        Share Your Experience
      </h2>
      <p className="text-primary-300 mb-6">
        Help other candidates by sharing your interview preparation experience
        with InterviewOrbit.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label className="text-primary-200 font-semibold">Your Name</label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter your name"
            className="px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={loading}
          />
        </div>

        {/* Rating Field */}
        <div className="flex flex-col gap-2">
          <label className="text-primary-200 font-semibold">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                disabled={loading}
                className="transition-transform hover:scale-110"
              >
                <svg
                  width="32"
                  height="32"
                  fill={star <= rating ? "#FFD600" : "#666"}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Text Area */}
        <div className="flex flex-col gap-2">
          <label className="text-primary-200 font-semibold">
            Your Feedback
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience with InterviewOrbit (10-500 characters)... How has it helped you? What features do you love?"
            className="px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-24"
            disabled={loading}
            maxLength={500}
          />
          <p className="text-xs text-primary-400">
            {text.length}/500 characters
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-4"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </div>
  );
};

export default TestimonialForm;
