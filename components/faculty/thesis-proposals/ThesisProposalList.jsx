"use client";

import React, { useState } from "react"; // ✅ Add 'React' here
import ThesisProposalDetails from "./ThesisProposalDetails";

export default function ThesisProposalList() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const pendingProposals = [
    {
      id: 1,
      name: "Sadika Tabassum",
      studentId: "220042147",
      program: "MSc in CSE",
      title: "Machine Learning Applications in Healthcare Diagnosis",
      date: "16/08/2025",
      area: "Machine Learning",
      motivation:
        "Passionate about applying ML to solve real-world healthcare problems.",
      contact: "sadikaTabassum@iut-dhaka.edu",
      attachment: "220042147_ThesisProposal.pdf",
    },
    {
      id: 2,
      name: "Farzana Islam Majumdar",
      studentId: "220042155",
      program: "PhD in CSE",
      title: "Federated Learning in Edge Computing",
      date: "08/07/2025",
    },
  ];

  const approvedProposals = [
    {
      id: 3,
      name: "Naniba Samira Razin",
      studentId: "220042155",
      program: "MSc in CSE",
      title: "AI-Based Predictive Models for Early Disease Detection",
      date: "05/07/2025",
    },
    {
      id: 4,
      name: "Ayesha Mashi'at",
      studentId: "220042156",
      program: "PhD in CSE",
      title: "Emotion Recognition Using Multimodal Deep Learning Architectures",
      date: "04/07/2025",
    },
  ];

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
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p) => (
              <React.Fragment key={p.id}>
                <tr className="border-t border-gray-200">
                  <td className="px-6 py-3">{p.name}</td>
                  <td className="px-6 py-3">{p.studentId}</td>
                  <td className="px-6 py-3">{p.program}</td>
                  <td className="px-6 py-3">{p.title}</td>
                  <td className="px-6 py-3">{p.date}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => toggleDetails(p.id)}
                      className={`text-sm px-4 py-1.5 rounded transition ${
                        expandedId === p.id
                          ? "bg-blue-100 text-black"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {expandedId === p.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {expandedId === p.id && (
                  <tr className="border-t border-gray-100">
                    <td colSpan={6} className="px-6 py-4 bg-gray-50">
                      <ThesisProposalDetails proposal={p} />
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

  return (
    <div className="space-y-10">
      {renderTable(pendingProposals, "Pending Thesis Proposals")}
      {renderTable(approvedProposals, "Approved Thesis Proposals")}
    </div>
  );
}
