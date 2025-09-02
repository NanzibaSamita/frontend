"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const API = "http://localhost:8080";
const APPROVED_STATUSES = ["Approved", "PGCApproved"];

export default function ThesisPage() {
  const [status, setStatus] = useState({
    proposal: "Not Submitted",
    thesis: "Not Submitted",
    defense: "Not Scheduled",
  });
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);

  // raw progress from server
  const [progress, setProgress] = useState([]);

  // Proposal
  const [proposalData, setProposalData] = useState(null);
  const [showProposalDetails, setShowProposalDetails] = useState(false);

  // Thesis
  const [thesisData, setThesisData] = useState(null);
  const [showThesisDetails, setShowThesisDetails] = useState(false);

  // Proposal form
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

  // Thesis form
  const [thesisForm, setThesisForm] = useState({ title: "", abstract: "" });
  const [thesisFile, setThesisFile] = useState(null);
  const [fileResetKey, setFileResetKey] = useState(0); // to clear file input after submit

  // derived flags
  const proposalAccepted =
    (proposalData && APPROVED_STATUSES.includes(proposalData.status)) ||
    progress?.some(
      (s) => (s.step === "Thesis" || s.step === "Thesis Upload") && s.unlocked
    );

  const thesisApproved =
    thesisData &&
    (thesisData.status === "PGCApproved" || thesisData.status === "Approved");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("You are not logged in.");
          setPageLoading(false);
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Progress/eligibility
        const progressRes = await axios.get(`${API}/api/students/progress`, {
          headers,
        });
        const pdata = progressRes.data;
        setProgress(Array.isArray(pdata.progress) ? pdata.progress : []);
        if (pdata.isEligible !== undefined) setEligible(pdata.isEligible);
        if (pdata.studentInfo) setStudentInfo(pdata.studentInfo);
        if (pdata.message) setMessage(pdata.message);

        // Proposal
        try {
          const pr = await axios.get(`${API}/api/students/my-proposal`, {
            headers,
          });
          if (pr.data?.proposal) {
            setProposalData(pr.data.proposal);
            setStatus((s) => ({ ...s, proposal: pr.data.proposal.status }));
            // prefill thesis title from approved proposal
            setThesisForm((t) => ({
              ...t,
              title: pr.data.proposal.title || t.title,
            }));
          }
        } catch {}

        // Thesis
        try {
          const tr = await axios.get(`${API}/api/students/my-thesis`, {
            headers,
          });
          if (tr.data?.thesis) {
            setThesisData(tr.data.thesis);
            setStatus((s) => ({ ...s, thesis: tr.data.thesis.status }));
          }
        } catch {}
      } catch (e) {
        console.error(e);
        setMessage("Failed to load data.");
        setEligible(false);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* ---------------- Proposal Submit ---------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const canSubmitNewProposal =
    !proposalAccepted &&
    eligible &&
    (!proposalData ||
      ["Rejected", "RevisionRequested"].includes(proposalData.status));

  const handleSubmitProposal = async () => {
    if (!eligible)
      return setMessage(
        "You are not eligible to submit a thesis proposal yet."
      );
    if (
      !form.research_topic ||
      !form.title ||
      !form.background ||
      !form.objective ||
      !form.methodology
    ) {
      return setMessage("Please fill in all required fields.");
    }

    const token = localStorage.getItem("token");
    setLoading(true);
    setMessage("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("attachment", file);

      const res = await fetch(`${API}/api/students/submit/check`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to submit proposal.");

      setStatus((s) => ({ ...s, proposal: "Submitted" }));
      setMessage("Thesis proposal submitted successfully!");

      const pr = await axios.get(`${API}/api/students/my-proposal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (pr.data?.proposal) setProposalData(pr.data.proposal);

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
    } catch (e) {
      console.error(e);
      setMessage(e.message || "Error submitting thesis proposal.");
    } finally {
      setLoading(false);
    }
  };

  const downloadProposalPDF = async () => {
    if (!proposalData?.attachment) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API}/api/students/proposal-pdf/${proposalData._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) return setMessage("Failed to download PDF.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `thesis-proposal-${proposalData._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      setMessage("Error downloading PDF.");
    }
  };

  /* ---------------- Thesis Submit ---------------- */
  const handleThesisChange = (e) =>
    setThesisForm({ ...thesisForm, [e.target.name]: e.target.value });
  const handleThesisFileChange = (e) => setThesisFile(e.target.files[0]);

  const canSubmitThesis = useMemo(() => {
    return (
      proposalAccepted &&
      (!thesisData ||
        ["Rejected", "RevisionRequested"].includes(thesisData.status))
    );
  }, [proposalAccepted, thesisData]);

  const thesisDisabledReason = useMemo(() => {
    if (!proposalAccepted) return "Your proposal must be accepted first.";
    if (!canSubmitThesis) {
      if (!thesisData) return ""; // handled by fields required
      if (["Submitted", "Under Review"].includes(thesisData.status))
        return "Your thesis is already under review.";
      if (thesisApproved) return "Your thesis is already approved.";
    }
    return "";
  }, [proposalAccepted, canSubmitThesis, thesisApproved, thesisData]);

  const handleSubmitThesis = async () => {
    if (!proposalAccepted)
      return setMessage(
        "Your proposal must be accepted before submitting a thesis."
      );
    if (!thesisForm.title) return setMessage("Thesis title is required.");
    if (!thesisFile) return setMessage("Please attach your thesis PDF.");

    const token = localStorage.getItem("token");
    setLoading(true);
    setMessage("");

    try {
      const fd = new FormData();
      fd.append("title", thesisForm.title);
      fd.append("abstract", thesisForm.abstract || "");
      fd.append("attachment", thesisFile);

      const res = await fetch(`${API}/api/students/thesis/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit thesis.");

      setMessage("Thesis submitted successfully!");

      // refresh thesis info from backend to keep UI in sync
      const tr = await axios.get(`${API}/api/students/my-thesis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (tr.data?.thesis) {
        setThesisData(tr.data.thesis);
        setStatus((s) => ({ ...s, thesis: tr.data.thesis.status }));
      } else {
        setThesisData(data.thesis);
        setStatus((s) => ({
          ...s,
          thesis: data.thesis?.status || "Submitted",
        }));
      }

      // clear file input
      setThesisFile(null);
      setFileResetKey((k) => k + 1);
    } catch (e) {
      console.error(e);
      setMessage(e.message || "Error submitting thesis.");
    } finally {
      setLoading(false);
    }
  };

  const downloadThesisPDF = async () => {
    if (!thesisData?.attachment) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API}/api/students/thesis-pdf/${thesisData._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) return setMessage("Failed to download thesis PDF.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `thesis-${thesisData._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      setMessage("Error downloading thesis PDF.");
    }
  };

  /* ---------------- Status helpers ---------------- */
  const proposalStatusMsg = (() => {
    if (proposalAccepted) {
      if (proposalData?.status === "PGCApproved")
        return {
          type: "success",
          message:
            "Your thesis proposal has been approved by PGC. You may proceed to Thesis submission.",
        };
      return {
        type: "success",
        message:
          "Your thesis proposal is accepted. You may proceed to Thesis submission.",
      };
    }
    if (!proposalData) return null;
    switch (proposalData.status) {
      case "Submitted":
      case "Under Review":
        return {
          type: "info",
          message: "Your proposal is under review by your supervisor.",
        };
      case "Approved":
        return {
          type: "success",
          message: "Supervisor approved. Waiting for PGC approval.",
        };
      case "Rejected":
        return {
          type: "error",
          message: "Your proposal was rejected. See feedback and resubmit.",
        };
      case "RevisionRequested":
        return {
          type: "warning",
          message: "Revisions requested. See feedback and resubmit.",
        };
      default:
        return null;
    }
  })();

  const thesisStatusMsg = (() => {
    if (!thesisData) return null;
    switch (thesisData.status) {
      case "Submitted":
      case "Under Review":
        return {
          type: "info",
          message: "Your thesis is under review by your supervisor.",
        };
      case "Approved":
        return {
          type: "success",
          message: "Supervisor approved thesis. Waiting for PGC approval.",
        };
      case "PGCApproved":
        return {
          type: "success",
          message:
            "Your thesis has been approved by PGC. Proceed to Predefense when available.",
        };
      case "Rejected":
        return {
          type: "error",
          message: "Your thesis was rejected. See feedback and resubmit.",
        };
      case "RevisionRequested":
        return {
          type: "warning",
          message: "Thesis revisions requested. See feedback and resubmit.",
        };
      case "PGCRejected":
        return {
          type: "error",
          message: "PGC rejected your thesis. See feedback and resubmit.",
        };
      default:
        return null;
    }
  })();

  /* ---------------- Render ---------------- */
  if (pageLoading) {
    return (
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-center items-center h-64 text-gray-500">
            Loading thesis information...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8">
      <h2 className="text-3xl font-semibold text-black mb-8">Thesis</h2>

      {/* Eligibility */}
      <div className="max-w-4xl mx-auto mb-6">
        {eligible ? (
          <div className="p-4 bg-green-50 border border-green-300 text-green-800 rounded-lg">
            <strong>Eligible:</strong> You can submit your thesis proposal.
            {studentInfo && (
              <div className="mt-2 text-sm">
                CGPA: {studentInfo.cgpa} | Credits:{" "}
                {studentInfo.obtained_credits} | Supervisor:{" "}
                {studentInfo.hasSupervisor ? "Assigned" : "Not Assigned"}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg">
            <strong>Not Eligible:</strong> You cannot submit a thesis proposal
            yet.
          </div>
        )}
      </div>

      {/* Proposal Status Banner */}
      {proposalStatusMsg && (
        <div className="max-w-4xl mx-auto mb-6">
          <div
            className={`p-4 border rounded-lg ${
              proposalStatusMsg.type === "success"
                ? "bg-green-50 border-green-300 text-green-800"
                : proposalStatusMsg.type === "error"
                ? "bg-red-50 border-red-300 text-red-700"
                : proposalStatusMsg.type === "warning"
                ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                : "bg-blue-50 border-blue-300 text-blue-800"
            }`}
          >
            {proposalStatusMsg.message}
          </div>
        </div>
      )}

      {/* Proposal Feedback */}
      {proposalData?.feedbackHistory?.length > 0 && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-700 text-xl font-semibold mb-4">
              Supervisor/PGC Feedback on Proposal
            </h3>
            <div className="space-y-4">
              {proposalData.feedbackHistory.map((fb, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border-l-4 ${
                    fb.status === "Approved"
                      ? "border-green-500 bg-green-50"
                      : fb.status === "Rejected"
                      ? "border-red-500 bg-red-50"
                      : fb.status === "Comment"
                      ? "border-blue-500 bg-blue-50"
                      : "border-yellow-500 bg-yellow-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{fb.status}</span>
                    <span className="text-sm text-gray-600">
                      {new Date(fb.date).toLocaleDateString()}
                    </span>
                  </div>
                  {fb.feedback && (
                    <p className="text-gray-700">{fb.feedback}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Approved Proposal Details + Download */}
      {proposalAccepted && proposalData && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Your Approved Proposal</h3>
              <div className="space-x-2">
                <button
                  onClick={() => setShowProposalDetails(!showProposalDetails)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {showProposalDetails ? "Hide Details" : "View Details"}
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
              <div className="space-y-4 border-t pt-4 text-gray-900">
                <Field
                  label="Research Topic"
                  value={proposalData.research_topic}
                />
                <Field label="Title" value={proposalData.title} />
                <Field label="Background" value={proposalData.background} pre />
                <Field label="Objective" value={proposalData.objective} pre />
                <Field
                  label="Methodology"
                  value={proposalData.methodology}
                  pre
                />
                {proposalData.estimated_cost && (
                  <Field
                    label="Estimated Cost"
                    value={proposalData.estimated_cost}
                  />
                )}
                {proposalData.timeline && (
                  <Field label="Timeline" value={proposalData.timeline} />
                )}
                {proposalData.references && (
                  <Field
                    label="References"
                    value={proposalData.references}
                    pre
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Proposal Submission Form */}
      {canSubmitNewProposal && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-gray-700 text-xl font-semibold mb-4">
            Submit Thesis Proposal
          </h3>
          <ProposalForm
            form={form}
            onChange={handleChange}
            onFile={handleFileChange}
            onSubmit={handleSubmitProposal}
            loading={loading}
          />
        </div>
      )}

      {/* ---------- THESIS SUBMISSION ---------- */}
      {proposalAccepted && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-gray-700 text-2xl font-semibold mb-4">
            Thesis Submission
          </h3>

          {/* Status banner */}
          {thesisStatusMsg && (
            <div
              className={`p-3 mb-4 rounded border ${
                thesisStatusMsg.type === "success"
                  ? "bg-green-50 border-green-300 text-green-800"
                  : thesisStatusMsg.type === "error"
                  ? "bg-red-50 border-red-300 text-red-700"
                  : thesisStatusMsg.type === "warning"
                  ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                  : "bg-blue-50 border-blue-300 text-blue-800"
              }`}
            >
              {thesisStatusMsg.message}
            </div>
          )}

          {/* Current thesis details */}
          {thesisData && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-semibold text-gray-800">
                  Current Submission
                </h4>
                <div className="space-x-2">
                  <button
                    onClick={() => setShowThesisDetails(!showThesisDetails)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {showThesisDetails ? "Hide Details" : "View Details"}
                  </button>
                  {thesisData.attachment && (
                    <button
                      onClick={downloadThesisPDF}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Download PDF
                    </button>
                  )}
                </div>
              </div>

              {showThesisDetails && (
                <div className="space-y-3 border-t pt-3">
                  <Field label="Title" value={thesisData.title} />
                  {thesisData.abstract && (
                    <Field label="Abstract" value={thesisData.abstract} pre />
                  )}
                  <Field label="Status" value={thesisData.status} />
                  {thesisData.feedbackHistory?.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Feedback History
                      </div>
                      <div className="space-y-2">
                        {thesisData.feedbackHistory.map((f, i) => (
                          <div
                            key={i}
                            className="p-3 rounded bg-gray-50 border"
                          >
                            <div className="text-sm font-semibold">
                              {f.status} •{" "}
                              {new Date(f.date).toLocaleDateString()} (
                              {f.reviewedBy})
                            </div>
                            {f.feedback && (
                              <div className="text-gray-700">{f.feedback}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submission form — always visible once proposal is accepted */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSubmitThesis) return;
              handleSubmitThesis();
            }}
            className="space-y-4"
          >
            <div className="text-sm text-gray-600">
              Submit your thesis PDF for supervisor review.
              {thesisDisabledReason && (
                <span className="ml-1 text-gray-500">
                  ({thesisDisabledReason})
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thesis Title *
              </label>
              <input
                type="text"
                name="title"
                value={thesisForm.title}
                onChange={handleThesisChange}
                placeholder="Enter thesis title"
                className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading || (!canSubmitThesis && !thesisData)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Abstract
              </label>
              <textarea
                name="abstract"
                value={thesisForm.abstract}
                onChange={handleThesisChange}
                rows={4}
                placeholder="(Optional) Short abstract"
                className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading || (!canSubmitThesis && !thesisData)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PDF Attachment *
              </label>
              <input
                key={fileResetKey} // lets us clear after submit
                type="file"
                accept="application/pdf"
                onChange={handleThesisFileChange}
                className="w-full"
                disabled={loading || !canSubmitThesis}
              />
            </div>

            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                if (!canSubmitThesis) return;
                handleSubmitThesis();
              }}
              disabled={loading || !canSubmitThesis}
              className={`py-3 px-6 rounded-md text-white font-semibold ${
                loading || !canSubmitThesis
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              title={!canSubmitThesis ? thesisDisabledReason : "Submit Thesis"}
            >
              {loading
                ? "Submitting..."
                : thesisData &&
                  ["Rejected", "RevisionRequested"].includes(thesisData.status)
                ? "Resubmit Thesis"
                : "Submit Thesis"}
            </button>
          </form>
        </div>
      )}

      {/* Global message */}
      {message && (
        <div
          className={`max-w-4xl mx-auto mb-6 p-3 border rounded-lg ${
            /successfully/i.test(message)
              ? "bg-green-50 border-green-300 text-green-800"
              : /(error|failed)/i.test(message)
              ? "bg-red-50 border-red-300 text-red-700"
              : "bg-blue-50 border-blue-300 text-blue-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* Progress */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-gray-700 text-2xl font-semibold mb-6">
          Thesis Progress
        </h3>
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
                status: proposalAccepted
                  ? "completed"
                  : proposalData
                  ? "pending"
                  : "locked",
              },
              {
                name: "Thesis Upload",
                status: thesisApproved
                  ? "completed"
                  : proposalAccepted
                  ? "pending"
                  : "locked",
              },
              {
                name: "Predefense",
                status: thesisApproved ? "pending" : "locked",
              },
              {
                name: "Defense",
                status: status.defense === "Scheduled" ? "completed" : "locked",
              },
            ].map((step, idx, arr) => (
              <div key={idx} className="flex items-center space-x-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step.status === "completed"
                      ? "bg-green-600 text-white"
                      : step.status === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step.status === "completed" ? "✓" : idx + 1}
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
                {idx < arr.length - 1 && (
                  <div
                    className={`w-px h-8 ${
                      step.status === "completed"
                        ? "bg-green-300"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- Small helpers ---------- */
function Field({ label, value, pre = false }) {
  if (!value) return null;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {pre ? (
        <p className="text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">
          {value}
        </p>
      ) : (
        <p className="text-gray-900 bg-gray-50 p-3 rounded">{value}</p>
      )}
    </div>
  );
}

function ProposalForm({ form, onChange, onFile, onSubmit, loading }) {
  return (
    <div className="space-y-4">
      {[
        ["Research Topic *", "research_topic", "Enter your research topic"],
        ["Thesis Title *", "title", "Enter your thesis title"],
      ].map(([label, name, ph]) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            type="text"
            name={name}
            placeholder={ph}
            value={form[name]}
            onChange={onChange}
            className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      ))}

      {[
        [
          "Background *",
          "background",
          "Describe the background and context of your research",
          4,
        ],
        ["Objective *", "objective", "State your research objectives", 3],
        [
          "Methodology *",
          "methodology",
          "Describe your research methodology",
          4,
        ],
      ].map(([label, name, ph, rows]) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <textarea
            name={name}
            placeholder={ph}
            value={form[name]}
            onChange={onChange}
            rows={rows}
            className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      ))}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Estimated Cost"
          name="estimated_cost"
          value={form.estimated_cost}
          onChange={onChange}
          placeholder="Enter estimated cost"
        />
        <Input
          label="Timeline"
          name="timeline"
          value={form.timeline}
          onChange={onChange}
          placeholder="Enter expected timeline"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          References
        </label>
        <textarea
          name="references"
          placeholder="List your references"
          value={form.references}
          onChange={onChange}
          rows={3}
          className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          PDF Attachment
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={onFile}
          className="w-full"
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className={`py-3 px-6 rounded-md text-white font-semibold ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit Proposal"}
      </button>
    </div>
  );
}

function Input({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}
