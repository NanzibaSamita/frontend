"use client";
import { FileText, MessageCircle, CheckCircle, XCircle } from "lucide-react";

export default function ThesisProposalDetails({ proposal }) {
  return (
    <div className="border rounded-xl p-6 shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{proposal.name}</h3>
          <p className="text-gray-700">{proposal.studentId}</p>
          <p className="text-sm font-medium text-blue-600 bg-blue-100 px-2 inline-block mt-1 rounded">
            {proposal.program}
          </p>
        </div>
        <p className="text-gray-500 font-medium">Requested: {proposal.date}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 text-gray-800">
        <div>
          <p className="font-semibold">Research Area:</p>
          <p className="text-gray-500">{proposal.area || "N/A"}</p>

          <p className="font-semibold mt-4">Proposed Thesis Title:</p>
          <p className="text-gray-500">{proposal.title}</p>

          <p className="font-semibold mt-4">Attachments</p>
          <a href="#" className="text-blue-600 flex items-center gap-1 mt-1">
            <FileText size={16} />
            {proposal.attachment}
          </a>
        </div>

        <div>
          <p className="font-semibold">Motivation</p>
          <p className="text-gray-500">
            {proposal.motivation || "No description provided."}
          </p>

          <p className="font-semibold mt-4">Contact:</p>
          <p className="text-gray-500">{proposal.contact || "N/A"}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
          <MessageCircle size={16} />
          Comment
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700">
          <CheckCircle size={16} />
          Approve
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-700">
          <XCircle size={16} />
          Reject
        </button>
      </div>
    </div>
  );
}
