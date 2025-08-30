"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ThesisPage() {
  const [status, setStatus] = useState({
    proposal: "Not Submitted",
    thesis: "Not Submitted",
    defense: "Not Scheduled",
  });
  const [eligible, setEligible] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [proposalSubmitted, setProposalSubmitted] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [form, setForm] = useState({
    research_topic: "",
    title: "",
    background: "",
    objective: "",
    methodology: "",
    estimated_cost: "",
    timeline: "",
    references: "",
  });
  const [file, setFile] = useState(null);

  // ✅ Fetch current thesis progress + eligibility
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("You are not logged in.");
          setEligible(false);
          setPageLoading(false);
          return;
        }

        const res = await axios.get(
          "http://localhost:8080/api/students/progress",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;
        // Set eligibility
        if (data.isEligible !== undefined) {
          setEligible(data.isEligible);
        } else {
          const proposalUnlocked = data.progress?.find(
            (p) => p.step === "Thesis Proposal"
          )?.unlocked;
          setEligible(!!proposalUnlocked);
        }

        if (data.studentInfo) setStudentInfo(data.studentInfo);
        if (data.message) setMessage(data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Failed to load data.");
        setEligible(false);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle PDF file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitProposal = async () => {
    if (!eligible) {
      setMessage("You are not eligible to submit a thesis proposal yet.");
      return;
    }

    // ✅ Validate required fields
    if (
      !form.research_topic ||
      !form.title ||
      !form.background ||
      !form.objective ||
      !form.methodology
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (file) formData.append("attachment", file);

      const res = await fetch(
        "http://localhost:8080/api/students/submit/check",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setStatus({ ...status, proposal: "Submitted" });
        setProposalSubmitted(true);
        setMessage("Thesis proposal submitted successfully!");

        // ✅ Clear form after successful submission
        setForm({
          research_topic: "",
          title: "",
          background: "",
          objective: "",
          methodology: "",
          estimated_cost: "",
          timeline: "",
          references: "",
        });
        setFile(null);
      } else {
        setMessage(data.message || "Failed to submit proposal.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error submitting thesis proposal.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading thesis information...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8">
      <h2 className="text-3xl font-semibold text-black mb-8">Thesis</h2>

      {/* Eligibility Status */}
      <div className="max-w-4xl mx-auto mb-6">
        {eligible ? (
          <div className="p-4 bg-green-50 border border-green-300 text-green-800 rounded-lg">
            <strong>Eligible:</strong> You can submit your thesis proposal.
            {studentInfo && (
              <div className="mt-2 text-sm">
                CGPA: {studentInfo.cgpa} | Credits: {studentInfo.credits} |
                Supervisor:{" "}
                {studentInfo.hasSupervisor ? "Assigned" : "Not Assigned"}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg">
            <strong>Not Eligible:</strong> You cannot submit a thesis proposal
            yet.
            {studentInfo && (
              <div className="mt-2 text-sm">
                CGPA: {studentInfo.cgpa} | Credits: {studentInfo.credits} |
                Supervisor:{" "}
                {studentInfo.hasSupervisor ? "Assigned" : "Not Assigned"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Proposal Submission Form */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {proposalSubmitted
            ? "Thesis Proposal (Submitted)"
            : "Submit Thesis Proposal"}
        </h3>

        {proposalSubmitted && (
          <div className="p-4 mb-4 bg-green-50 border-green-300 text-green-700 rounded-lg">
            Your thesis proposal has been submitted and is under review.
          </div>
        )}

        <div className="space-y-4">
          {/* Inputs for proposal submission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Research Topic *
            </label>
            <input
              type="text"
              name="research_topic"
              placeholder="Enter your research topic"
              value={form.research_topic}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!eligible || proposalSubmitted}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thesis Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter your thesis title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!eligible || proposalSubmitted}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background *
            </label>
            <textarea
              name="background"
              placeholder="Describe the background and context of your research"
              value={form.background}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!eligible || proposalSubmitted}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objective *
            </label>
            <textarea
              name="objective"
              placeholder="State your research objectives"
              value={form.objective}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!eligible || proposalSubmitted}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Methodology *
            </label>
            <textarea
              name="methodology"
              placeholder="Describe your research methodology"
              value={form.methodology}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!eligible || proposalSubmitted}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Cost
              </label>
              <input
                type="text"
                name="estimated_cost"
                placeholder="Enter estimated cost"
                value={form.estimated_cost}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!eligible || proposalSubmitted}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timeline
              </label>
              <input
                type="text"
                name="timeline"
                placeholder="Enter expected timeline"
                value={form.timeline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!eligible || proposalSubmitted}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              References
            </label>
            <textarea
              name="references"
              placeholder="List your references"
              value={form.references}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!eligible || proposalSubmitted}
            />
          </div>

          {/* PDF Attachment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PDF Attachment
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={!eligible || proposalSubmitted}
              className="w-full"
            />
          </div>

          <button
            onClick={handleSubmitProposal}
            disabled={loading || proposalSubmitted || !eligible}
            className={`py-3 px-6 rounded-md text-white font-semibold ${
              !eligible
                ? "bg-gray-300 cursor-not-allowed"
                : proposalSubmitted
                ? "bg-gray-300 cursor-not-allowed"
                : loading
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {!eligible
              ? "Not Eligible"
              : proposalSubmitted
              ? "Already Submitted"
              : loading
              ? "Submitting..."
              : "Submit Proposal"}
          </button>

          {message && (
            <div
              className={`p-3 border rounded-lg ${
                message.includes("successfully")
                  ? "bg-green-50 border-green-300 text-green-800"
                  : message.includes("Error") || message.includes("Failed")
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "bg-blue-50 border-blue-300 text-blue-800"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Thesis Progress Timeline */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-6">Thesis Progress</h3>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            {[
              { name: "Supervisor Assignment", status: "completed" },
              {
                name: "Thesis Proposal",
                status: status.proposal === "Submitted" ? "completed" : "pending",
              },
              {
                name: "Thesis Upload",
                status: status.thesis === "Submitted" ? "completed" : "locked",
              },
              { name: "Predefense", status: "locked" },
              {
                name: "Defense",
                status: status.defense === "Scheduled" ? "completed" : "locked",
              },
            ].map((step, index, arr) => (
              <div key={index} className="flex items-center space-x-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step.status === "completed"
                      ? "bg-green-600 text-white"
                      : step.status === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step.status === "completed" ? "✓" : index + 1}
                </div>

                <div className="flex-1">
                  <span
                    className={`text-lg ${
                      step.status === "completed"
                        ? "text-green-700 font-semibold"
                        : step.status === "pending"
                        ? "text-yellow-700 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </span>

                  <div className="text-sm text-gray-600">
                    {step.status === "completed" && "Completed"}
                    {step.status === "pending" && "In Progress"}
                    {step.status === "locked" &&
                      "Locked - Complete previous steps"}
                  </div>
                </div>

                {index < arr.length - 1 && (
                  <div
                    className={`w-px h-8 ${
                      step.status === "completed"
                        ? "bg-green-300"
                        : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}