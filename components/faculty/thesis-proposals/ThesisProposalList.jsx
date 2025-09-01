"use client";

import React from "react";
import ThesisProposalDetails from "./ThesisProposalDetails";

export default function ThesisProposalList({
  proposals,
  expandedId,
  onSelectProposal,
  onReview,
}) {
  const renderTable = (proposals, label) => (
    <div className="mb-10">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{label}</h3>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <table className="min-w-full text-sm text-gray-900">
          <thead className="bg-gray-100 text-left font-semibold text-gray-700 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3">Student</th>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Program</th>
              <th className="px-6 py-3">Proposed Title</th>
              <th className="px-6 py-3">Submitted on</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p) => (
              <React.Fragment key={p._id}>
                <tr className="border-t border-gray-200">
                  <td className="px-6 py-3">{p.student_id?.name}</td>
                  <td className="px-6 py-3">{p.student_id?.student_id}</td>
                  <td className="px-6 py-3">{p.program}</td>
                  <td className="px-6 py-3">{p.title}</td>
                  <td className="px-6 py-3">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">{p.status}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() =>
                        onSelectProposal(expandedId === p._id ? null : p)
                      }
                      className={`text-sm px-4 py-1.5 rounded transition ${
                        expandedId === p._id
                          ? "bg-blue-100 text-black"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {expandedId === p._id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {expandedId === p._id && (
                  <tr className="border-t border-gray-100">
                    <td colSpan={7} className="px-6 py-4 bg-gray-50">
                      <ThesisProposalDetails proposal={p} onReview={onReview} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return <div className="space-y-10">{renderTable(proposals, "Thesis Proposals")}</div>;
}
