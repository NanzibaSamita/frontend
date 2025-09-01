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
  const [studentInfo, setStudentInfo] = useState(null);
  const [proposalData, setProposalData] = useState(null); // Store current proposal data
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
  const [showProposalDetails, setShowProposalDetails] = useState(false);

  // ✅ Fetch current thesis progress + eligibility + existing proposal
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

        // Fetch progress and eligibility
        const progressRes = await axios.get(
          "http://localhost:8080/api/students/progress",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = progressRes.data;
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

        // Fetch existing proposal if any
        try {
          const proposalRes = await axios.get(
            "http://localhost:8080/api/students/my-proposal",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          if (proposalRes.data && proposalRes.data.proposal) {
            setProposalData(proposalRes.data.proposal);
            setStatus(prev => ({ ...prev, proposal: proposalRes.data.proposal.status }));
          }
        } catch (proposalError) {
          // No proposal exists yet, which is fine
          console.log("No existing proposal found");
        }

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
        setMessage("Thesis proposal submitted successfully!");

        // Refresh proposal data
        const proposalRes = await axios.get(
          "http://localhost:8080/api/students/my-proposal",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (proposalRes.data && proposalRes.data.proposal) {
          setProposalData(proposalRes.data.proposal);
        }

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

  const canSubmitNewProposal = () => {
    return eligible && (!proposalData || proposalData.status === 'Rejected' || proposalData.status === 'RevisionRequested');
  };

  const getProposalStatusMessage = () => {
    if (!proposalData) return null;

    switch (proposalData.status) {
      case 'Submitted':
      case 'Under Review':
        return {
          type: 'info',
          message: 'Your thesis proposal has been submitted and is under review by your supervisor.'
        };
      case 'Approved':
        return {
          type: 'success',
          message: 'Your thesis proposal has been approved by your supervisor and is now awaiting PGC approval.'
        };
      case 'Rejected':
        return {
          type: 'error',
          message: 'Your thesis proposal has been rejected by your supervisor. Please review the feedback below and submit a revised proposal.'
        };
      case 'RevisionRequested':
        return {
          type: 'warning',
          message: 'Your supervisor has requested revisions to your thesis proposal. Please review the feedback below and submit a revised proposal.'
        };
      default:
        return null;
    }
  };

  const downloadProposalPDF = async () => {
    if (!proposalData || !proposalData.attachment) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/students/proposal-pdf/${proposalData._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `thesis-proposal-${proposalData._id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setMessage("Failed to download PDF.");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setMessage("Error downloading PDF.");
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

  const statusMessage = getProposalStatusMessage();

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
                CGPA: {studentInfo.cgpa} | Credits: {studentInfo.obtained_credits} |
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
                CGPA: {studentInfo.cgpa} | Credits: {studentInfo.obtained_credits} |
                Supervisor:{" "}
                {studentInfo.hasSupervisor ? "Assigned" : "Not Assigned"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Current Proposal Status */}
      {statusMessage && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className={`p-4 border rounded-lg ${
            statusMessage.type === 'success' ? 'bg-green-50 border-green-300 text-green-800' :
            statusMessage.type === 'error' ? 'bg-red-50 border-red-300 text-red-700' :
            statusMessage.type === 'warning' ? 'bg-yellow-50 border-yellow-300 text-yellow-800' :
            'bg-blue-50 border-blue-300 text-blue-800'
          }`}>
            {statusMessage.message}
          </div>
        </div>
      )}

      {/* Feedback History */}
      {proposalData && proposalData.feedbackHistory && proposalData.feedbackHistory.length > 0 && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Supervisor Feedback</h3>
            <div className="space-y-4">
              {proposalData.feedbackHistory.map((feedback, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  feedback.status === 'Approved' ? 'border-green-500 bg-green-50' :
                  feedback.status === 'Rejected' ? 'border-red-500 bg-red-50' :
                  feedback.status === 'Comment' ? 'border-blue-500 bg-blue-50' :
                  'border-yellow-500 bg-yellow-50'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-semibold ${
                      feedback.status === 'Approved' ? 'text-green-800' :
                      feedback.status === 'Rejected' ? 'text-red-800' :
                      feedback.status === 'Comment' ? 'text-blue-800' :
                      'text-yellow-800'
                    }`}>
                      {feedback.status}
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(feedback.date).toLocaleDateString()}
                    </span>
                  </div>
                  {feedback.feedback && (
                    <p className="text-gray-700">{feedback.feedback}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Current Proposal Details (for approved proposals) */}
      {proposalData && proposalData.status === 'Approved' && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Your Approved Proposal</h3>
              <div className="space-x-2">
                <button
                  onClick={() => setShowProposalDetails(!showProposalDetails)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {showProposalDetails ? 'Hide Details' : 'View Details'}
                </button>
                {proposalData.attachment && (
                  <button
                    onClick={downloadProposalPDF}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Download PDF
                  </button>
                )}
              </div>
            </div>
            
            {showProposalDetails && (
              <div className="space-y-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Research Topic</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{proposalData.research_topic}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{proposalData.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">{proposalData.background}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">{proposalData.objective}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Methodology</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">{proposalData.methodology}</p>
                </div>
                {proposalData.estimated_cost && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded">{proposalData.estimated_cost}</p>
                  </div>
                )}
                {proposalData.timeline && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded">{proposalData.timeline}</p>
                  </div>
                )}
                {proposalData.references && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">References</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">{proposalData.references}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Proposal Submission Form */}
      {canSubmitNewProposal() && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {proposalData && (proposalData.status === 'Rejected' || proposalData.status === 'RevisionRequested') 
              ? "Resubmit Thesis Proposal" 
              : "Submit Thesis Proposal"}
          </h3>

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
                className="w-full"
              />
            </div>

            <button
              onClick={handleSubmitProposal}
              disabled={loading}
              className={`py-3 px-6 rounded-md text-white font-semibold ${
                loading
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading
                ? "Submitting..."
                : proposalData && (proposalData.status === 'Rejected' || proposalData.status === 'RevisionRequested')
                ? "Resubmit Proposal"
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
      )}

      {/* Thesis Progress Timeline */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-6">Thesis Progress</h3>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            {[
              {
                name: "Supervisor Assignment",
                status: studentInfo?.hasSupervisor
                  ? "completed"
                  : eligible
                  ? "pending"
                  : "locked",
              },
              {
                name: "Thesis Proposal",
                status: proposalData && proposalData.status === 'Approved' ? "completed" : 
                       proposalData ? "pending" : "locked",
              },
              {
                name: "Thesis Upload",
                status: proposalData && proposalData.status === 'Approved' ? "pending" : "locked",
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
