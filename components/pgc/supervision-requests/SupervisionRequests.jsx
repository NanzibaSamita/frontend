"use client";

import { useMemo, useState } from "react";

export default function SupervisionRequests() {
  /* -------------------- Dummy data -------------------- */
  const pending = useMemo(
    () => [
      {
        id: "220042147",
        name: "Sadika Tabassum",
        program: "MSc in CSE",
        supervisorInterested: "Aashanan Rahman",
        submittedOn: "09/07/2025",
        researchArea: "Machine Learning",
        proposedTitle: "Machine Learning Applications in Healthcare Diagnosis",
        motivation:
          "Passionate about applying ML to solve real-world healthcare problems.",
        cgpa: "3.50",
        department: "Computer Science and Engineering",
        domain: "Deep Learning",
        studentsSupervised: "1/3",
        contact: "sadikatabassum@iut-dhaka.edu",
      },
      {
        id: "220042155",
        name: "Farzana Islam Majumdar",
        program: "PhD in CSE",
        supervisorInterested: "Maliha Noushin Raida",
        submittedOn: "08/07/2025",
        researchArea: "Federated Learning",
        proposedTitle: "Federated Learning in Edge Computing",
        motivation:
          "Exploring privacy-preserving training at the edge for robustness.",
        cgpa: "3.72",
        department: "Computer Science and Engineering",
        domain: "Distributed ML",
        studentsSupervised: "—",
        contact: "farzana@iut-dhaka.edu",
      },
    ],
    []
  );

  const assigned = useMemo(
    () => [
      {
        id: "220042155",
        name: "Nanziba Samtia Razin",
        program: "MSc in CSE",
        supervisor: "Abu Raham Mostofa Kamal",
        submittedOn: "05/07/2025",
        researchArea: "Medical AI",
        proposedTitle: "AI-Based Predictive Models for Early Disease Detection",
        motivation:
          "To assist clinicians with earlier detection using explainable AI.",
        cgpa: "3.78",
        department: "Computer Science and Engineering",
        domain: "Applied ML",
        studentsSupervised: "2/3",
        contact: "nanziba.razin@iut-dhaka.edu",
      },
      {
        id: "220042156",
        name: "Ayesha Mashiát",
        program: "PhD in CSE",
        supervisor: "Dr. Md. Azam Hossain",
        submittedOn: "04/07/2025",
        researchArea: "Multimodal Learning",
        proposedTitle:
          "Emotion Recognition Using Multimodal Deep Learning Architectures",
        motivation: "Understanding emotion signals for assistive interfaces.",
        cgpa: "3.90",
        department: "Computer Science and Engineering",
        domain: "Deep Learning",
        studentsSupervised: "1/3",
        contact: "ayesha.mashiat@iut-dhaka.edu",
      },
    ],
    []
  );

  /* -------------------- State -------------------- */
  const [openPendingFor, setOpenPendingFor] = useState(null);
  const [openAssignedFor, setOpenAssignedFor] = useState(null);

  /* -------------------- Render -------------------- */
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Supervisor Approval</h1>

      {/* Pending card */}
      <Card title="Pending Supervisor Approval" className="mb-8">
        <Table
          headers={[
            "Student",
            "ID",
            "Program",
            "Supervisor Interested",
            "Submitted on",
            "",
          ]}
        >
          {pending.map((s) => (
            <tr key={s.id} className="border-t">
              <Td className="whitespace-pre-wrap">{s.name}</Td>
              <Td>{s.id}</Td>
              <Td className="whitespace-pre-wrap">{s.program}</Td>
              <Td className="truncate max-w-[260px]">
                {s.supervisorInterested}
              </Td>
              <Td>{s.submittedOn}</Td>
              <Td className="text-right">
                <button
                  onClick={() =>
                    setOpenPendingFor((cur) => (cur?.id === s.id ? null : s))
                  }
                  className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  {openPendingFor?.id === s.id ? "Hide" : "View"}
                </button>
              </Td>
            </tr>
          ))}
        </Table>

        {/* Drop-down detail (Pending) with actions */}
        {openPendingFor && (
          <DetailDropDown
            summary={{
              student: openPendingFor.name,
              id: openPendingFor.id,
              program: openPendingFor.program,
              sup: openPendingFor.supervisorInterested,
              date: openPendingFor.submittedOn,
            }}
            studentInfo={{
              Name: openPendingFor.name,
              ID: openPendingFor.id,
              "Research Area": openPendingFor.researchArea,
              "Proposed Thesis Title": openPendingFor.proposedTitle,
              Motivation: openPendingFor.motivation,
              CGPA: openPendingFor.cgpa,
            }}
            supervisorInfo={{
              Name: openPendingFor.supervisorInterested,
              ID: openPendingFor.id,
              Department: openPendingFor.department,
              Domain: openPendingFor.domain,
              "Students Supervised": openPendingFor.studentsSupervised,
              Contact: openPendingFor.contact,
            }}
            showActions={true}
            onComment={() => alert("Comment clicked")}
            onApprove={() => alert("Approved")}
            onReject={() => alert("Rejected")}
          />
        )}
      </Card>

      {/* Assigned supervisors card */}
      <Card title="Assigned Supervisors">
        <Table
          headers={[
            "Student",
            "ID",
            "Program",
            "Supervisor",
            "Submitted on",
            "",
          ]}
        >
          {assigned.map((s) => (
            <tr key={s.id} className="border-t">
              <Td className="whitespace-pre-wrap">{s.name}</Td>
              <Td>{s.id}</Td>
              <Td className="whitespace-pre-wrap">{s.program}</Td>
              <Td className="truncate max-w-[260px]">{s.supervisor}</Td>
              <Td>{s.submittedOn}</Td>
              <Td className="text-right">
                <button
                  onClick={() =>
                    setOpenAssignedFor((cur) => (cur?.id === s.id ? null : s))
                  }
                  className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  {openAssignedFor?.id === s.id ? "Hide" : "View"}
                </button>
              </Td>
            </tr>
          ))}
        </Table>

        {/* Drop-down detail (Assigned) without actions */}
        {openAssignedFor && (
          <DetailDropDown
            summary={{
              student: openAssignedFor.name,
              id: openAssignedFor.id,
              program: openAssignedFor.program,
              sup: openAssignedFor.supervisor,
              date: openAssignedFor.submittedOn,
            }}
            studentInfo={{
              Name: openAssignedFor.name,
              ID: openAssignedFor.id,
              "Research Area": openAssignedFor.researchArea,
              "Proposed Thesis Title": openAssignedFor.proposedTitle,
              Motivation: openAssignedFor.motivation,
              CGPA: openAssignedFor.cgpa,
            }}
            supervisorInfo={{
              Name: openAssignedFor.supervisor,
              ID: openAssignedFor.id,
              Department: openAssignedFor.department,
              Domain: openAssignedFor.domain,
              "Students Supervised": openAssignedFor.studentsSupervised,
              Contact: openAssignedFor.contact,
            }}
            showActions={false}
          />
        )}
      </Card>
    </div>
  );
}

/* -------------------- Drop-down details block -------------------- */
function DetailDropDown({
  summary,
  studentInfo,
  supervisorInfo,
  showActions = true,
  onComment,
  onApprove,
  onReject,
}) {
  return (
    <div className="mt-6 border rounded bg-white">
      {/* summary table */}
      <div className="rounded border m-4 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <Th>Student</Th>
              <Th>ID</Th>
              <Th>Program</Th>
              <Th>Supervisor</Th>
              <Th>Submitted on</Th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <Td>{summary.student}</Td>
              <Td>{summary.id}</Td>
              <Td>{summary.program}</Td>
              <Td>{summary.sup}</Td>
              <Td>{summary.date}</Td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* two-column info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <InfoCard title="Student Information">
          {Object.entries(studentInfo).map(([k, v]) => (
            <InfoRow key={k} label={k} value={v} />
          ))}
        </InfoCard>

        <InfoCard title="Supervisor Information">
          {Object.entries(supervisorInfo).map(([k, v]) => (
            <InfoRow key={k} label={k} value={v} />
          ))}
        </InfoCard>
      </div>

      {/* actions only when requested */}
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

/* -------------------- UI helpers -------------------- */
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
      <td className="w-40 sm:w-48 text-gray-600 px-3 py-2">{label}</td>
      <td className="px-3 py-2">{value || "-"}</td>
    </tr>
  );
}
