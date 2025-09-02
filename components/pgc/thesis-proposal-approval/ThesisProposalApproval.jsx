// components/pgc/thesis-proposal-approval/ThesisProposalApproval.jsx
"use client";

import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API || "http://localhost:8080";

export default function ThesisProposalApproval() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [openPendingFor, setOpenPendingFor] = useState(null);
  const [openApprovedFor, setOpenApprovedFor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeaders = () => {
    const token = localStorage.getItem("token"); // <-- real JWT
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // Map backend doc -> UI shape
  const buildAttachmentUrl = (raw) => {
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw)) return raw; // already absolute

    let p = String(raw).replace(/\\/g, "/"); // windows -> posix
    if (!p.startsWith("/")) p = "/" + p; // ensure leading slash
    if (!/^\/uploads\//.test(p)) p = "/uploads" + p; // mount point from server.js

    return `${API}${p}`;
  };

  const fileLabel = (raw) => {
    if (!raw) return "Proposal File";
    const p = String(raw).replace(/\\/g, "/");
    return p.split("/").pop() || "Proposal File";
  };

  /* --- mapper --- */
  const toView = (p) => {
    const url = buildAttachmentUrl(p.attachment);

    return {
      proposalId: p._id,
      id: p.student_id?.student_number || p._id,
      name: p.student_id?.user_id
        ? `${p.student_id.user_id.first_name} ${p.student_id.user_id.last_name}`
        : "Unknown Student",
      program: p.student_id?.program_id || "Unknown Program",
      title: p.title,
      researchTopic: p.research_topic,
      objective: p.objective,
      background: p.background,
      methodology: p.methodology,
      timeline: p.timeline,
      estimatedCost: p.estimated_cost,
      references: p.references,
      submittedOn: new Date(p.createdAt).toLocaleDateString("en-GB"),
      contact: p.student_id?.user_id?.email || "N/A",
      supervisor: p.supervisor_id?.user_id
        ? `${p.supervisor_id.user_id.first_name} ${p.supervisor_id.user_id.last_name}`
        : "Unknown Supervisor",
      feedback: p.feedback,
      feedbackHistory: p.feedbackHistory || [],
      attachments: url ? [{ label: fileLabel(p.attachment), url }] : [],
    };
  };

  const fetchLists = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ PGC still needs to review supervisor-approved items
      const pendingRes = await fetch(
        `${API}/api/pgc/thesis-proposals?status=Approved`,
        { headers: authHeaders() }
      );
      if (!pendingRes.ok) {
        throw new Error(
          `Failed to fetch pending proposals: ${pendingRes.status} ${pendingRes.statusText}`
        );
      }
      const pendingJson = await pendingRes.json();

      // ✅ Already PGC approved
      const approvedRes = await fetch(
        `${API}/api/pgc/thesis-proposals?status=PGCApproved`,
        { headers: authHeaders() }
      );
      if (!approvedRes.ok) {
        throw new Error(
          `Failed to fetch approved proposals: ${approvedRes.status} ${approvedRes.statusText}`
        );
      }
      const approvedJson = await approvedRes.json();

      setPending((pendingJson.proposals || []).map(toView));
      setApproved((approvedJson.proposals || []).map(toView));
      setOpenPendingFor(null);
      setOpenApprovedFor(null);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const review = async (proposalId, status, feedback = "") => {
    try {
      setActionLoading(true);
      setError(null);

      const res = await fetch(`${API}/api/pgc/thesis-proposals/review`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ proposalId, status, feedback }),
      });
      if (!res.ok) {
        throw new Error(
          `Failed to ${status.toLowerCase()} proposal: ${res.status} ${
            res.statusText
          }`
        );
      }

      await fetchLists(); // refresh both tables
      alert(`Proposal ${status.toLowerCase()} successfully`);
    } catch (e) {
      console.error(e);
      setError(e.message);
      alert(`Error: ${e.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  if (loading) return <div className="p-6">Loading proposals…</div>;

  if (error)
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded">
          Error: {error}
          <div className="mt-2">
            <button
              onClick={fetchLists}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          Thesis Proposal Approvals (PGC)
        </h1>
        <button
          onClick={fetchLists}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
        >
          Refresh
        </button>
      </div>

      <Card
        title={`Pending Thesis Proposals (${pending.length})`}
        className="mb-8"
      >
        <ListTable
          items={pending}
          empty="No pending proposals for review."
          openFor={openPendingFor}
          setOpenFor={setOpenPendingFor}
          onReview={review}
          actionLoading={actionLoading}
          showActions
        />
      </Card>

      <Card title={`PGC Approved Thesis Proposals (${approved.length})`}>
        <ListTable
          items={approved}
          empty="No PGC-approved proposals yet."
          openFor={openApprovedFor}
          setOpenFor={setOpenApprovedFor}
          onReview={review}
          actionLoading={actionLoading}
          showActions={false}
        />
      </Card>
    </div>
  );
}

/* ---------- Reusable bits ---------- */

function ListTable({
  items,
  empty,
  openFor,
  setOpenFor,
  onReview,
  actionLoading,
  showActions,
}) {
  if (items.length === 0) {
    return <div className="p-4 text-gray-500 text-center">{empty}</div>;
  }

  return (
    <>
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
        {items.map((p) => (
          <tr key={p.proposalId} className="border-t">
            <Td className="whitespace-pre-wrap">{p.name}</Td>
            <Td>{p.id}</Td>
            <Td className="whitespace-pre-wrap">{p.program}</Td>
            <Td className="whitespace-pre-wrap">{p.title}</Td>
            <Td>{p.submittedOn}</Td>
            <Td className="text-right">
              <button
                onClick={() =>
                  setOpenFor((cur) =>
                    cur?.proposalId === p.proposalId ? null : p
                  )
                }
                className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                disabled={actionLoading}
              >
                {openFor?.proposalId === p.proposalId ? "Hide" : "View"}
              </button>
            </Td>
          </tr>
        ))}
      </Table>

      {openFor && (
        <Details
          data={openFor}
          showActions={showActions}
          actionLoading={actionLoading}
          onApprove={(fb) => onReview(openFor.proposalId, "Approved", fb)}
          onReject={(fb) => onReview(openFor.proposalId, "Rejected", fb)}
          onComment={(fb) => onReview(openFor.proposalId, "Comment", fb)}
        />
      )}
    </>
  );
}

function Details({
  data,
  showActions,
  actionLoading,
  onApprove,
  onReject,
  onComment,
}) {
  const [feedback, setFeedback] = useState("");
  const [mode, setMode] = useState(null);

  const submit = () => {
    if (mode === "Rejected" && !feedback.trim()) return;
    if (mode === "Approved") onApprove(feedback);
    else if (mode === "Rejected") onReject(feedback);
    else if (mode === "Comment") onComment(feedback);
    setFeedback("");
    setMode(null);
  };

  return (
    <div className="mt-6 border rounded bg-white">
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
              <Td>{data.name}</Td>
              <Td>{data.id}</Td>
              <Td>{data.program}</Td>
              <Td>{data.title}</Td>
              <Td>{data.submittedOn}</Td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <InfoCard title="Thesis Proposal Details">
          <InfoRow label="Research Topic" value={data.researchTopic} />
          <InfoRow label="Background" value={data.background} />
          <InfoRow label="Methodology" value={data.methodology} />
          <InfoRow label="Timeline" value={data.timeline || "-"} />
          <InfoRow label="Estimated Cost" value={data.estimatedCost || "-"} />
          <InfoRow label="References" value={data.references || "-"} />
          <InfoRow
            label="Attachments"
            value={
              data.attachments.length
                ? data.attachments.map((a) => (
                    <a
                      key={a.url}
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      {a.label}
                    </a>
                  ))
                : "-"
            }
          />
        </InfoCard>

        <InfoCard title="Supervisor & Contact">
          <InfoRow label="Supervisor" value={data.supervisor} />
          <InfoRow label="Objective" value={data.objective} />
          <InfoRow label="Contact" value={data.contact} />
          <InfoRow
            label="Previous Feedback"
            value={
              data.feedbackHistory.length ? (
                <div className="space-y-1">
                  {data.feedbackHistory.map((f, i) => (
                    <div key={i} className="text-xs bg-gray-50 p-2 rounded">
                      <div className="font-medium">
                        {f.status} • {new Date(f.date).toLocaleDateString()}
                      </div>
                      <div>{f.feedback}</div>
                    </div>
                  ))}
                </div>
              ) : (
                "No previous feedback"
              )
            }
          />
        </InfoCard>
      </div>

      {mode && (
        <div className="mx-4 mb-4 p-4 bg-gray-50 rounded border">
          <div className="mb-2 font-medium">
            {mode === "Comment"
              ? "Add Comment"
              : mode === "Approved"
              ? "Approval Feedback (Optional)"
              : "Rejection Feedback (Required)"}
          </div>
          <textarea
            className="w-full p-2 border rounded h-24 resize-none"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={
              mode === "Comment"
                ? "Enter your comment..."
                : mode === "Approved"
                ? "Optional approval notes..."
                : "Please provide reason for rejection..."
            }
            disabled={actionLoading}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={submit}
              disabled={
                actionLoading || (mode === "Rejected" && !feedback.trim())
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm disabled:opacity-50"
            >
              {actionLoading ? "Processing..." : `Submit ${mode}`}
            </button>
            <button
              onClick={() => {
                setMode(null);
                setFeedback("");
              }}
              disabled={actionLoading}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showActions && !mode && (
        <div className="flex gap-3 px-4 pb-4">
          <button
            onClick={() => setMode("Comment")}
            disabled={actionLoading}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            Comment
          </button>
          <button
            onClick={() => setMode("Approved")}
            disabled={actionLoading}
            className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => setMode("Rejected")}
            disabled={actionLoading}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

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
      <td className="w-44 sm:w-56 text-gray-600 px-3 py-2 align-top">
        {label}
      </td>
      <td className="px-3 py-2">{value || "-"}</td>
    </tr>
  );
}
