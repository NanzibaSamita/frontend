"use client";

import { useMemo, useState } from "react";

export default function ThesisProposalApproval() {
  /* -------------------- Dummy data -------------------- */
  const pending = useMemo(
    () => [
      {
        id: "220042147",
        name: "Sadika Tabassum",
        program: "MSc in CSE",
        title: "Machine Learning Applications in Healthcare Diagnosis",
        submittedOn: "09/07/2025",

        // details
        requestedOn: "16-08-2025",
        researchTopic: "Machine Learning",
        supervisor: "Ashanan Rahman",
        objective:
          "Passionate about applying ML to solve real-world healthcare problems.",
        attachments: [{ label: "220042147_ThesisProposal.pdf", url: "#" }],
        contact: "sadikaTabassum@iut-dhaka.edu",
      },
      {
        id: "220042155",
        name: "Farzana Islam Majumdar",
        program: "PhD in CSE",
        title: "Federated Learning in Edge Computing",
        submittedOn: "08/07/2025",

        requestedOn: "16-08-2025",
        researchTopic: "Federated Learning",
        supervisor: "Maliha Noushin Raida",
        objective:
          "Exploring privacy-preserving training at the edge for robustness.",
        attachments: [{ label: "220042155_ThesisProposal.pdf", url: "#" }],
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
        title: "AI-Based Predictive Models for Early Disease Detection",
        submittedOn: "05/07/2025",

        requestedOn: "12-08-2025",
        researchTopic: "Medical AI",
        supervisor: "Abu Raham Mostofa Kamal",
        objective:
          "Assist clinicians with earlier detection using explainable AI.",
        attachments: [{ label: "220042155_ThesisProposal.pdf", url: "#" }],
        contact: "nanziba.razin@iut-dhaka.edu",
      },
      {
        id: "220042156",
        name: "Ayesha Mashiát",
        program: "PhD in CSE",
        title:
          "Emotion Recognition Using Multimodal Deep Learning Architectures",
        submittedOn: "04/07/2025",

        requestedOn: "10-08-2025",
        researchTopic: "Multimodal Learning",
        supervisor: "Dr. Md. Azam Hossain",
        objective: "Understanding multimodal emotion signals for assistance.",
        attachments: [{ label: "220042156_ThesisProposal.pdf", url: "#" }],
        contact: "ayesha.mashiat@iut-dhaka.edu",
      },
    ],
    []
  );

  /* -------------------- State -------------------- */
  const [openPendingFor, setOpenPendingFor] = useState(null);
  const [openApprovedFor, setOpenApprovedFor] = useState(null);

  /* -------------------- Render -------------------- */
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Thesis Proposal Approvals</h1>

      {/* Pending */}
      <Card title="Pending Thesis Proposals" className="mb-8">
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
              <Td className="whitespace-pre-wrap">{p.title}</Td>
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
          <DetailsBlock
            summary={{
              student: openPendingFor.name,
              id: openPendingFor.id,
              program: openPendingFor.program,
              title: openPendingFor.title,
              date: openPendingFor.submittedOn,
            }}
            leftTitle="Thesis Proposals Details"
            showActions={true}
            dataLeft={[
              { label: "Name", value: openPendingFor.name },
              { label: "ID", value: openPendingFor.id },
              { label: "Research Topic", value: openPendingFor.researchTopic },
              { label: "Proposed Thesis Title", value: openPendingFor.title },
              {
                label: "Attachments",
                value:
                  openPendingFor.attachments?.map((a) => (
                    <a
                      key={a.label}
                      href={a.url}
                      className="text-blue-600 hover:underline"
                    >
                      {a.label}
                    </a>
                  )) || "-",
              },
            ]}
            dataRight={[
              { label: "Supervisor", value: openPendingFor.supervisor },
              { label: "Objective", value: openPendingFor.objective },
              { label: "Contact", value: openPendingFor.contact },
              { label: "Requested", value: openPendingFor.requestedOn },
            ]}
            onComment={() => alert("Comment")}
            onApprove={() => alert("Approved")}
            onReject={() => alert("Rejected")}
          />
        )}
      </Card>

      {/* Approved */}
      <Card title="Approved Thesis Proposals">
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
              <Td className="whitespace-pre-wrap">{a.title}</Td>
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
          <DetailsBlock
            summary={{
              student: openApprovedFor.name,
              id: openApprovedFor.id,
              program: openApprovedFor.program,
              title: openApprovedFor.title,
              date: openApprovedFor.submittedOn,
            }}
            leftTitle="Thesis Proposals Details"
            showActions={false} // no actions for approved
            dataLeft={[
              { label: "Name", value: openApprovedFor.name },
              { label: "ID", value: openApprovedFor.id },
              { label: "Research Topic", value: openApprovedFor.researchTopic },
              { label: "Proposed Thesis Title", value: openApprovedFor.title },
              {
                label: "Attachments",
                value:
                  openApprovedFor.attachments?.map((a) => (
                    <a
                      key={a.label}
                      href={a.url}
                      className="text-blue-600 hover:underline"
                    >
                      {a.label}
                    </a>
                  )) || "-",
              },
            ]}
            dataRight={[
              { label: "Supervisor", value: openApprovedFor.supervisor },
              { label: "Objective", value: openApprovedFor.objective },
              { label: "Contact", value: openApprovedFor.contact },
              { label: "Requested", value: openApprovedFor.requestedOn },
            ]}
          />
        )}
      </Card>
    </div>
  );
}

/* ==================== Details Block ==================== */
function DetailsBlock({
  summary,
  leftTitle,
  dataLeft,
  dataRight,
  showActions = true,
  onComment,
  onApprove,
  onReject,
}) {
  return (
    <div className="mt-6 border rounded bg-white">
      {/* small summary bar */}
      <div className="rounded border m-4 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <Th>Student</Th>
              <Th>ID</Th>
              <Th>Program</Th>
              <Th>Proposed Title</Th>
              <Th>Submitted on</Th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <Td>{summary.student}</Td>
              <Td>{summary.id}</Td>
              <Td>{summary.program}</Td>
              <Td>{summary.title}</Td>
              <Td>{summary.date}</Td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <InfoCard title={leftTitle}>
          {dataLeft.map((row) => (
            <InfoRow key={row.label} label={row.label} value={row.value} />
          ))}
        </InfoCard>

        <InfoCard title="Supervisor">
          {dataRight.map((row) => (
            <InfoRow key={row.label} label={row.label} value={row.value} />
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

/* ==================== Small UI helpers ==================== */
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
function Th({ children }) {
  return <th className="text-left px-3 py-2">{children}</th>;
}
function Td({ className = "", children }) {
  return <td className={`px-5 py-3 align-top ${className}`}>{children}</td>;
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
      <td className="w-44 sm:w-56 text-gray-600 px-3 py-2">{label}</td>
      <td className="px-3 py-2">{value || "-"}</td>
    </tr>
  );
}
