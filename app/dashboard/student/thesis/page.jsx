"use client";

import { useState, useEffect } from "react";

export default function ThesisPage() {
  const [status, setStatus] = useState({
    proposal: "Not Submitted",
    thesis: "Not Submitted",
    defense: "Not Scheduled",
  });
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    supervisor_id: "",
    title: "",
    background: "",
    objective: "",
    methodology: "",
    estimated_cost: "",
    timeline: "",
    references: "",
  });

  // Fetch current thesis progress + eligibility
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/students/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.progress) {
          // Eligibility comes from backend
          setEligible(data.eligible || false);

          const proposalUnlocked = data.progress.find(
            (p) => p.step === "Thesis Proposal"
          )?.unlocked;
          const thesisUnlocked = data.progress.find(
            (p) => p.step === "Thesis Upload"
          )?.unlocked;
          const defenseUnlocked = data.progress.find(
            (p) => p.step === "Defense"
          )?.unlocked;

          setStatus({
            proposal: proposalUnlocked ? "Submitted" : "Not Submitted",
            thesis: thesisUnlocked ? "Submitted" : "Not Submitted",
            defense: defenseUnlocked ? "Scheduled" : "Not Scheduled",
          });
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitProposal = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/api/students/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ ...status, proposal: "Submitted" });
        setMessage("✅ Thesis proposal submitted successfully!");
      } else {
        setMessage(data.error || "❌ Failed to submit proposal.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Error submitting thesis proposal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-8">
      <h2 className="text-3xl font-semibold text-black mb-8">Thesis</h2>

      {/* Proposal Submission Form */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Submit Thesis Proposal</h3>

        {!eligible && (
          <div className="p-4 mb-4 bg-red-50 border border-red-300 text-red-700 rounded-lg">
            ⚠️ You are not eligible to submit a thesis proposal yet.  
            Requirement: <b>CGPA &gt; 2.5</b> and <b>Obtained Credits ≥ 9</b>.
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Thesis Title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            disabled={!eligible}
          />
          <textarea
            name="background"
            placeholder="Background"
            value={form.background}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            disabled={!eligible}
          />
          <textarea
            name="objective"
            placeholder="Objective"
            value={form.objective}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            disabled={!eligible}
          />
          <textarea
            name="methodology"
            placeholder="Methodology"
            value={form.methodology}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            disabled={!eligible}
          />

          <button
            onClick={handleSubmitProposal}
            disabled={
              loading || status.proposal === "Submitted" || !eligible
            }
            className={`py-3 px-6 rounded-md text-white font-semibold ${
              !eligible
                ? "bg-gray-300 cursor-not-allowed"
                : loading
                ? "bg-gray-400"
                : status.proposal === "Submitted"
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {!eligible
              ? "Not Eligible"
              : status.proposal === "Submitted"
              ? "Submitted"
              : loading
              ? "Submitting..."
              : "Submit Proposal"}
          </button>

          {message && (
            <div className="p-3 bg-blue-50 border border-blue-300 text-blue-800 rounded-lg">
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Thesis Progress Timeline */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Thesis Status</h3>
        <div className="flex items-center space-x-4 flex-wrap">
          {[
            "Supervisor Assignment",
            "Thesis Proposal",
            "Thesis Upload",
            "Predefense",
            "Defense",
          ].map((step, index, arr) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  (step === "Thesis Proposal" && status.proposal === "Submitted") ||
                  (step === "Thesis Upload" && status.thesis === "Submitted") ||
                  (step === "Defense" && status.defense === "Scheduled") ||
                  step === "Supervisor Assignment"
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              ></div>
              <span className="text-lg text-black">{step}</span>
              {index < arr.length - 1 && (
                <div className="w-12 h-0.5 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
