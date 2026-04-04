"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CreateInterviewPage() {
  const [role, setRole] = useState("");
  const [type, setType] = useState("technical");
  const [level, setLevel] = useState("junior");
  const [techstack, setTechstack] = useState("");
  const [amount, setAmount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, demoMode = false) {
    e.preventDefault();
    demoMode ? setDemoLoading(true) : setLoading(true);
    
    try {
      const res = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          role,
          level,
          techstack,
          amount,
          demoMode,
        }),
      });
      const data = await res.json();
      
      if (res.ok && data.id) {
        toast.success(demoMode ? "Demo interview created! (No API used)" : "Interview created successfully!");
        router.push(`/interview/${data.id}/call`);
      } else {
        if (res.status === 429 || data.error?.includes("quota")) {
          toast.error("AI quota exceeded. Use Demo Mode to test without API.");
        } else {
          toast.error(data.error || "Failed to create interview");
        }
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
      setDemoLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 py-8 px-4">
      <div className="max-w-lg mx-auto w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white text-center">Create New Interview</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Role
              </label>
              <input
                type="text"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 text-white border border-white/20 placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-colors text-sm sm:text-base"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                required
              />
            </div>
            
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Type
              </label>
              <select
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-colors text-sm sm:text-base"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="technical" className="bg-dark-800">Technical</option>
                <option value="behavioral" className="bg-dark-800">Behavioral</option>
                <option value="mixed" className="bg-dark-800">Mixed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Level
              </label>
              <select
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-colors text-sm sm:text-base"
                value={level}
                onChange={e => setLevel(e.target.value)}
              >
                <option value="junior" className="bg-dark-800">Junior</option>
                <option value="mid" className="bg-dark-800">Mid Level</option>
                <option value="senior" className="bg-dark-800">Senior</option>
              </select>
            </div>
            
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Tech Stack (comma separated)
              </label>
              <input
                type="text"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 text-white border border-white/20 placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-colors text-sm sm:text-base"
                value={techstack}
                onChange={e => setTechstack(e.target.value)}
                placeholder="React, TypeScript, Node.js"
                required
              />
            </div>
            
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                min={1}
                max={20}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-colors text-sm sm:text-base"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                required
              />
            </div>
            
            <div className="flex flex-col gap-3 sm:gap-4 pt-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 sm:py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-lg text-sm sm:text-base" 
                disabled={loading || demoLoading}
              >
                {loading ? "Creating..." : "Create Interview"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full border-purple-600 text-purple-200 hover:bg-purple-900/20 py-3 sm:py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] text-sm sm:text-base"
                disabled={loading || demoLoading}
                onClick={(e) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>, true)}
              >
                {demoLoading ? "Creating Demo..." : "⚡ Create Demo Interview (No API)"}
              </Button>
              
              <p className="text-xs sm:text-sm text-purple-300 text-center">
                Demo mode uses pre-generated questions without calling the AI API
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
