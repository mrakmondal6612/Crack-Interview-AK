"use client";
import React from "react";

const reviews = [
  {
    name: "Sarah M.",
    verified: true,
    text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    name: "Alex K.",
    verified: true,
    text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },
  {
    name: "James L.",
    verified: true,
    text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-[60vh] bg-white py-12 px-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-primary-900">Customer Reviews</h2>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl justify-center">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="border border-primary-200 rounded-lg p-6 w-full md:w-1/3 bg-white shadow-sm hover:shadow-lg transition relative"
            style={{ minHeight: 220 }}
          >
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="22" height="22" fill="#FFD600" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-lg text-primary-900">{review.name}</span>
              {review.verified && (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#22C55E"/><path d="M5 8.5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              )}
            </div>
            <p className="text-primary-700 text-base leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
