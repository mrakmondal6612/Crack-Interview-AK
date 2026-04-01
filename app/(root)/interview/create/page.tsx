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
    <div className="max-w-lg mx-auto mt-10 bg-dark-900 p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-primary-100">Create New Interview</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-primary-200">Role</label>
        <input
          type="text"
          className="px-3 py-2 rounded bg-dark-800 text-primary-100 border border-dark-700"
          value={role}
          onChange={e => setRole(e.target.value)}
          required
        />
        <label className="text-primary-200">Type</label>
        <select
          className="px-3 py-2 rounded bg-dark-800 text-primary-100 border border-dark-700"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="technical">Technical</option>
          <option value="behavioral">Behavioral</option>
          <option value="mixed">Mixed</option>
        </select>
        <label className="text-primary-200">Level</label>
        <select
          className="px-3 py-2 rounded bg-dark-800 text-primary-100 border border-dark-700"
          value={level}
          onChange={e => setLevel(e.target.value)}
        >
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>
        <label className="text-primary-200">Tech Stack (comma separated)</label>
        <input
          type="text"
          className="px-3 py-2 rounded bg-dark-800 text-primary-100 border border-dark-700"
          value={techstack}
          onChange={e => setTechstack(e.target.value)}
          required
        />
        <label className="text-primary-200">Number of Questions</label>
        <input
          type="number"
          min={1}
          max={20}
          className="px-3 py-2 rounded bg-dark-800 text-primary-100 border border-dark-700"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          required
        />
        <Button type="submit" className="w-full mt-4" disabled={loading || demoLoading}>
          {loading ? "Creating..." : "Create Interview"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={loading || demoLoading}
          onClick={(e) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>, true)}
        >
          {demoLoading ? "Creating Demo..." : "⚡ Create Demo Interview (No API)"}
        </Button>
        <p className="text-xs text-primary-300 text-center">
          Demo mode uses pre-generated questions without calling the AI API
        </p>
      </form>
    </div>
  );
}
