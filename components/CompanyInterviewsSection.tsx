"use client";
import React, { useState } from "react";

const companies = [
  {
    name: "Google",
    logo: "/covers/google.png",
    description: "Practice Google-style interviews with real questions and feedback.",
  },
  {
    name: "Amazon",
    logo: "/covers/amazon.png",
    description: "Get ready for Amazon's leadership principles and technical rounds.",
  },
  {
    name: "Meta",
    logo: "/covers/facebook.png",
    description: "Prepare for Meta's product sense and coding interviews.",
  },
  {
    name: "Microsoft",
    logo: "/covers/skype.png",
    description: "Sharpen your skills for Microsoft interviews and system design.",
  },
  {
    name: "Spotify",
    logo: "/covers/spotify.png",
    description: "Ace Spotify's culture and technical interview process.",
  },
  {
    name: "Pinterest",
    logo: "/covers/pinterest.png",
    description: "Practice for Pinterest's unique interview challenges.",
  },
];

export default function CompanyInterviewsSection() {
  const [search, setSearch] = useState("");
  const filtered = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <section className="w-full py-16 px-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-primary-100">Company-wise Mock Interviews</h2>
      <input
        type="text"
        placeholder="Search company..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-8 px-4 py-2 rounded bg-dark-800 text-primary-100 border border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-400 w-full max-w-xs"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {filtered.map((company, idx) => (
          <div key={idx} className="bg-dark-900 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <img src={company.logo} alt={company.name} className="w-16 h-16 object-contain mb-4 rounded-full bg-white" />
            <h3 className="text-xl font-bold text-primary-100 mb-2">{company.name}</h3>
            <p className="text-primary-300 text-center mb-4">{company.description}</p>
            <button className="bg-primary-500 hover:bg-primary-400 text-white px-6 py-2 rounded font-semibold transition">Start Interview</button>
          </div>
        ))}
      </div>
    </section>
  );
}
