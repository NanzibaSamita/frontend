"use client";
import { useState } from "react";
import { FileText, CheckCircle, XCircle } from "lucide-react";

export default function ThesisProposalDetails({ proposal, onReview }) {
  const [feedback, setFeedback] = useState("");

  const handleAction = (status) => {
    if (status === "Rejected" && !feedback.trim()) {
      alert("Feedback is required when rejecting a proposal.");
      return;
    }
    onReview(proposal._id, status, feedback);
  };

  return (
    <div className="border rounded-xl p-6 shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{proposal.student_id?.name}</h3>
          <p className="text-gray-700">{proposal.student_id?.student_number}</p>
          <p className="text-sm font-medium text-blue-600 bg-blue-100 px-2 inline-block mt-1 rounded">
            {proposal.program || "N/A"}
          </p>
        </div>
        <p className="text-gray-500 font-medium">
          Submitted: {new Date(proposal.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 text-gray-800">
        <div>
          <p className="font-semibold">Title:</p>
          <p className="text-gray-500">{proposal.title}</p>

          <p className="font-semibold mt-4">Attachment</p>
          {proposal.attachment ? (
            <a
              href={`http://localhost:8080${proposal.attachment}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 flex items-center gap-1 mt-1"
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
          <p className="text-gray-500">{proposal.objective || "N/A"}</p>

          <p className="font-semibold mt-4">Contact:</p>
          <p className="text-gray-500">{proposal.student_id?.email || "N/A"}</p>
        </div>
      </div>

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
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <CheckCircle size={16} />
          Approve
        </button>
        <button
          onClick={() => handleAction("Rejected")}
          className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-700"
        >
          <XCircle size={16} />
          Reject
        </button>
      </div>
    </div>
  );
}
