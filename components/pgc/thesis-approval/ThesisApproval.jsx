"use client";

import { useMemo, useState } from "react";

export default function ThesisApproval() {
  /* -------------------- Dummy data -------------------- */
  const pending = useMemo(
    () => [
      {
        id: "220042147",
        name: "Sadika Tabassum",
        program: "MSc in CSE",
        proposedTitle: "Machine Learning Applications in Healthcare Diagnosis",
        submittedOn: "09/07/2025",

        // Detail panel
        researchTopic: "Machine Learning",
        supervisor: "Aashanan Rahman",
        objective:
          "Passionate about applying ML to solve real-world healthcare problems.",
        attachments: "220042147_ThesisProposal.pdf",
        contact: "sadikaTabassum@iut-dhaka.edu",
      },
      {
        id: "220042155",
        name: "Farzana Islam Majumdar",
        program: "PhD in CSE",
        proposedTitle: "Federated Learning in Edge Computing",
        submittedOn: "08/07/2025",

        researchTopic: "Federated Learning",
        supervisor: "Maliha Noushin Raida",
        objective:
          "Exploring privacy-preserving training at the edge for robustness.",
        attachments: "220042155_ThesisProposal.pdf",
        contact: "farzana@iut-dhaka.edu",
      },
    ],
    []
  );

  const approved = useMemo(
    () => [
      {
        id: "220042155",
        name: "Nanziba Samtia Razin",
        program: "MSc in CSE",
        proposedTitle: "AI-Based Predictive Models for Early Disease Detection",
        submittedOn: "05/07/2025",

        researchTopic: "Medical AI",
        supervisor: "Abu Raham Mostofa Kamal",
        objective:
          "To assist clinicians with earlier detection using explainable AI.",
        attachments: "220042155_ThesisProposal.pdf",
        contact: "nanziba.razin@iut-dhaka.edu",
      },
      {
        id: "220042156",
        name: "Ayesha Mashiát",
        program: "PhD in CSE",
        proposedTitle:
          "Emotion Recognition Using Multimodal Deep Learning Architectures",
        submittedOn: "04/07/2025",

        researchTopic: "Multimodal Learning",
        supervisor: "Dr. Md. Azam Hossain",
        objective:
          "Understanding emotion signals for assistive interfaces and HCI.",
        attachments: "220042156_ThesisProposal.pdf",
        contact: "ayesha.mashiat@iut-dhaka.edu",
      },
    ],
    []
  );

  /* -------------------- State -------------------- */
  const [openPendingFor, setOpenPendingFor] = useState(null);
  const [openApprovedFor, setOpenApprovedFor] = useState(null);

  /* -------------------- UI -------------------- */
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Thesis Proposal Approvals</h1>

      {/* Pending */}
      <Card title="Pending Thesis">
        <Table
          headers={[
            "Student",
            "ID",
            "Program",
            "Proposed Title",
            "Submitted on",
            "",
          ]}
        >
          {pending.map((p) => (
            <tr key={p.id} className="border-t">
              <Td className="whitespace-pre-wrap">{p.name}</Td>
              <Td>{p.id}</Td>
              <Td className="whitespace-pre-wrap">{p.program}</Td>
              <Td className="max-w-[320px]">
                <span className="line-clamp-2">{p.proposedTitle}</span>
              </Td>
              <Td>{p.submittedOn}</Td>
              <Td className="text-right">
                <button
                  onClick={() =>
                    setOpenPendingFor((cur) => (cur?.id === p.id ? null : p))
                  }
                  className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  {openPendingFor?.id === p.id ? "Hide" : "View"}
                </button>
              </Td>
            </tr>
          ))}
        </Table>

        {openPendingFor && (
          <DetailDropDown
            title="Thesis Details"
            leftInfo={{
              "Student Name": openPendingFor.name,
              ID: openPendingFor.id,
              "Research Topic": openPendingFor.researchTopic,
              "Proposed Thesis Title": openPendingFor.proposedTitle,
              Attachments: openPendingFor.attachments,
            }}
            rightInfo={{
              Supervisor: openPendingFor.supervisor,
              Objective: openPendingFor.objective,
              Contact: openPendingFor.contact,
            }}
            showActions
            onComment={() => alert("Comment")}
            onApprove={() => alert("Approved")}
            onReject={() => alert("Rejected")}
          />
        )}
      </Card>

      {/* Approved */}
      <Card title="Approved Thesis" className="mt-8">
        <Table
          headers={[
            "Student",
            "ID",
            "Program",
            "Proposed Title",
            "Submitted on",
            "",
          ]}
        >
          {approved.map((a) => (
            <tr key={a.id} className="border-t">
              <Td className="whitespace-pre-wrap">{a.name}</Td>
              <Td>{a.id}</Td>
              <Td className="whitespace-pre-wrap">{a.program}</Td>
              <Td className="max-w-[320px]">
                <span className="line-clamp-2">{a.proposedTitle}</span>
              </Td>
              <Td>{a.submittedOn}</Td>
              <Td className="text-right">
                <button
                  onClick={() =>
                    setOpenApprovedFor((cur) => (cur?.id === a.id ? null : a))
                  }
                  className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  {openApprovedFor?.id === a.id ? "Hide" : "View"}
                </button>
              </Td>
            </tr>
          ))}
        </Table>

        {openApprovedFor && (
          <DetailDropDown
            title="Thesis Details"
            leftInfo={{
              "Student Name": openApprovedFor.name,
              ID: openApprovedFor.id,
              "Research Topic": openApprovedFor.researchTopic,
              "Proposed Thesis Title": openApprovedFor.proposedTitle,
              Attachments: openApprovedFor.attachments,
            }}
            rightInfo={{
              Supervisor: openApprovedFor.supervisor,
              Objective: openApprovedFor.objective,
              Contact: openApprovedFor.contact,
            }}
            showActions={false} // <- no buttons in the approved list
          />
        )}
      </Card>
    </div>
  );
}

/* -------------------- Reusable bits -------------------- */

function Card({ title, className = "", children }) {
  return (
    <div className={`bg-white rounded shadow-sm border ${className}`}>
      <div className="px-5 py-4 border-b font-semibold">{title}</div>
      <div>{children}</div>
    </div>
  );
}

function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-700">
            {headers.map((h, i) => (
              <th key={i} className="text-left font-medium px-5 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">{children}</tbody>
      </table>
    </div>
  );
}

function Td({ className = "", children }) {
  return <td className={`px-5 py-3 align-top ${className}`}>{children}</td>;
}

function DetailDropDown({
  title,
  leftInfo,
  rightInfo,
  showActions = true,
  onComment,
  onApprove,
  onReject,
}) {
  return (
    <div className="mt-6 rounded border bg-white">
      <div className="px-4 py-3 border-b text-sm font-medium">{title}</div>

      {/* two-column info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <InfoCard title="Thesis Details">
          {Object.entries(leftInfo).map(([k, v]) => (
            <InfoRow key={k} label={k} value={v} />
          ))}
        </InfoCard>

        <InfoCard title="Supervisor / Meta">
          {Object.entries(rightInfo).map(([k, v]) => (
            <InfoRow key={k} label={k} value={v} />
          ))}
        </InfoCard>
      </div>

      {showActions && (
        <div className="flex gap-3 px-4 pb-4">
          <button
            onClick={onComment}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Comment
          </button>
          <button
            onClick={onApprove}
            className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded border">
      <div className="bg-gray-50 px-3 py-2 text-sm font-medium">{title}</div>
      <table className="w-full text-sm">
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
function InfoRow({ label, value }) {
  return (
    <tr className="border-t">
      <td className="w-40 sm:w-48 text-gray-600 px-3 py-2">{label}</td>
      <td className="px-3 py-2">
        {String(value || "-").startsWith("http") ||
        String(value || "").endsWith(".pdf") ? (
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-blue-600 hover:underline"
          >
            {value}
          </a>
        ) : (
          value || "-"
        )}
      </td>
    </tr>
  );
}
