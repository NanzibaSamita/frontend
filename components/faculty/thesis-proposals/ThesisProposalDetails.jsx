"use client";

import { useMemo, useState } from "react";
import { FileText, CheckCircle, XCircle } from "lucide-react";

/**
 * Faculty view - review a single thesis proposal
 * Props:
 *  - proposal: ThesisProposal document (student_id and program populated)
 *  - onReview: (proposalId, status, feedback) => Promise<void>
 */
export default function ThesisProposalDetails({ proposal, onReview }) {
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Where your Node API lives (used to make absolute file URLs)
  const API_ORIGIN =
    (typeof window !== "undefined" &&
      (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/api\/?$/, "") ||
        process.env.NEXT_PUBLIC_API_ORIGIN)) ||
    "http://localhost:8080";

  const studentName = useMemo(() => {
    const u = proposal?.student_id?.user_id || {};
    const name = [u.first_name, u.last_name].filter(Boolean).join(" ");
    return name || "Student";
  }, [proposal]);

  const studentId = proposal?.student_id?.student_number || "—";

  const program = useMemo(() => {
    const p = proposal?.student_id?.program_id;
    if (p && typeof p === "object") {
      const pn = p.program_name || "";
      const dt = p.degree_type || "";
      return pn && dt ? `${pn} (${dt})` : pn || dt || "N/A";
    }
    return proposal?.program || "N/A";
  }, [proposal]);

  const submittedOn = proposal?.createdAt
    ? new Date(proposal.createdAt).toLocaleDateString()
    : "—";

  // Build a safe, absolute URL for the attachment
  const attachmentUrl = useMemo(() => {
    const att = proposal?.attachment;
    if (!att) return "";
    if (/^https?:\/\//i.test(att)) return att; // already absolute
    if (att.startsWith("/")) return `${API_ORIGIN}${att}`; // stored as "/uploads/.."
    return `${API_ORIGIN}/${att}`; // stored as "uploads/.."
  }, [proposal, API_ORIGIN]);

  // Final = faculty can no longer interact
  const isFinalized = useMemo(() => {
    const s = proposal?.status || "";
    return ["Approved", "Rejected", "PGCApproved", "PGCRejected"].includes(s);
  }, [proposal]);

  const handleAction = async (status) => {
    if (submitting) return;

    if (status === "Rejected" && !feedback.trim()) {
      alert("Feedback is required when rejecting a proposal.");
      return;
    }

    try {
      setSubmitting(true);
      await onReview(proposal._id, status, feedback);
      // After parent updates proposal status, this component will re-render
      // and hide the action buttons if finalized.
    } catch (e) {
      console.error(e);
      alert(e?.message || "Review failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 shadow-sm bg-white">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{studentName}</h3>
          <p className="text-gray-700">{studentId}</p>
          <p className="text-sm font-medium text-blue-600 bg-blue-100 px-2 inline-block mt-1 rounded">
            {program}
          </p>
        </div>

        <div className="text-right">
          <div className="text-gray-500 font-medium">
            Submitted: {submittedOn}
          </div>
          <span
            className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
              isFinalized
                ? proposal.status === "Approved" ||
                  proposal.status === "PGCApproved"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            Status: {proposal?.status || "—"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 text-gray-800">
        <div>
          <p className="font-semibold">Title:</p>
          <p className="text-gray-600">{proposal?.title || "—"}</p>

          <p className="font-semibold mt-4">Attachment</p>
          {attachmentUrl ? (
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 flex items-center gap-1 mt-1 hover:underline"
            >
              <FileText size={16} />
              Proposal File
            </a>
          ) : (
            <p className="text-gray-400">No file uploaded</p>
          )}
        </div>

        <div>
          <p className="font-semibold">Objective</p>
          <p className="text-gray-600">{proposal?.objective || "N/A"}</p>

          <p className="font-semibold mt-4">Contact</p>
          <p className="text-gray-600">
            {proposal?.student_id?.user_id?.email || "N/A"}
          </p>
        </div>
      </div>

      {/* Feedback + Actions (hidden if finalized) */}
      {!isFinalized && (
        <>
          <div className="mt-6">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add feedback (required if rejecting)"
              className="w-full border rounded p-2 mb-4"
              rows={3}
            />
          </div>

          <div className="mt-2 flex gap-4">
            <button
              onClick={() => handleAction("Approved")}
              disabled={submitting}
              className={`px-4 py-2 rounded flex items-center gap-2 text-white ${
                submitting
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <CheckCircle size={16} />
              {submitting ? "Saving..." : "Approve"}
            </button>

            <button
              onClick={() => handleAction("Rejected")}
              disabled={submitting}
              className={`px-4 py-2 rounded flex items-center gap-2 text-white ${
                submitting
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <XCircle size={16} />
              {submitting ? "Saving..." : "Reject"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
