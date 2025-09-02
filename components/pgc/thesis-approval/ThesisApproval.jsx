"use client";

import { useEffect, useState } from "react";

/** ---------- CONFIG (adjust only these if you add a proposals endpoint later) ---------- */
const API_BASE = "http://localhost:8080/api";

// If you later add a proposals endpoint, set these like:
// const PRIMARY_PENDING = `${API_BASE}/pgc/thesis-proposals?status=${encodeURIComponent("Submitted,Under Review,RevisionRequested")}`;
// const PRIMARY_APPROVED = `${API_BASE}/pgc/thesis-proposals?status=${encodeURIComponent("PGCApproved")}`;
const PRIMARY_PENDING = null; // currently not available in your backend
const PRIMARY_APPROVED = null; // currently not available in your backend

// Fallbacks that exist today:
const FALLBACK_PENDING = `${API_BASE}/pgc/supervision-requests`;
const FALLBACK_APPROVED = `${API_BASE}/pgc/assigned-supervisors`;

/** ------------------------------------------------------------------------------------- */

export default function ThesisApproval() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  const [openPendingFor, setOpenPendingFor] = useState(null);
  const [openApprovedFor, setOpenApprovedFor] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getJSON = async (url) => {
      if (!url) return null;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      // If route isn't there (404), just return null instead of throwing
      if (!res.ok) {
        if (res.status === 404) return null;
        let msg = `Request failed: ${res.status}`;
        try {
          const payload = await res.json();
          if (payload?.message) msg = payload.message;
        } catch {}
        throw new Error(msg);
      }
      return res.json();
    };

    // Map payload → the exact table row shape your UI expects
    const mapProposalToRow = (p) => {
      // student bits (try to normalize across shapes)
      const stu = p.student_id || {};
      const stuUser = stu.user_id || {};
      const name =
        [stuUser.first_name, stuUser.last_name].filter(Boolean).join(" ") ||
        p.studentName ||
        "-";
      const id = stu.student_number || p.student_number || p.id || "-";
      const program =
        stu.program_id?.program_name && stu.program_id?.degree_type
          ? `${stu.program_id.program_name} (${stu.program_id.degree_type})`
          : stu.program_id || p.program || "—";

      // supervisor
      const sup = p.supervisor_id || {};
      const supUser = sup.user_id || {};
      const supervisor =
        [supUser.first_name, supUser.last_name].filter(Boolean).join(" ") ||
        p.supervisor ||
        "-";

      // thesis fields
      const proposedTitle = p.title || p.proposedTitle || "-";
      const researchTopic = p.research_topic || p.researchTopic || "-";
      const objective = p.objective || "-";
      const attachments = p.attachment || p.attachments || "-";

      const submittedOn = formatDate(
        p.createdAt || p.created_at || p.submittedOn
      );
      const contact = stuUser.email || p.contact || "-";

      return {
        id: String(id),
        name,
        program,
        proposedTitle,
        submittedOn,
        researchTopic,
        supervisor,
        objective,
        attachments,
        contact,
        _raw: p,
      };
    };

    // Fallback mappers for the supervision endpoints (no thesis fields available)
    const mapSupervisionRequestToRow = (a) => {
      const stu = a.student_id || {};
      const u = stu.user_id || {};
      const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "-";
      const id = stu.student_number || "-";
      const program =
        stu.program_id?.program_name && stu.program_id?.degree_type
          ? `${stu.program_id.program_name} (${stu.program_id.degree_type})`
          : stu.program_id || "—";

      return {
        id: String(id),
        name,
        program,
        proposedTitle: "-", // not available from this endpoint
        submittedOn: "-", // not available
        researchTopic: "-", // not available
        supervisor: "-", // not available for pending requests list
        objective: "-",
        attachments: "-",
        contact: u.email || "-",
        _raw: a,
      };
    };

    const mapAssignedSupervisorToRow = (a) => {
      const stu = a.student_id || {};
      const u = stu.user_id || {};
      const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "-";
      const id = stu.student_number || "-";
      const program =
        stu.program_id?.program_name && stu.program_id?.degree_type
          ? `${stu.program_id.program_name} (${stu.program_id.degree_type})`
          : stu.program_id || "—";

      const fac = a.accepted_faculty || {};
      const facUser = fac.user_id || {};
      const supervisor =
        [facUser.first_name, facUser.last_name].filter(Boolean).join(" ") ||
        "-";

      return {
        id: String(id),
        name,
        program,
        proposedTitle: "-", // no thesis title here
        submittedOn: "-", // not available
        researchTopic: "-",
        supervisor,
        objective: "-",
        attachments: "-",
        contact: u.email || "-",
        _raw: a,
      };
    };

    const load = async () => {
      try {
        // ---------- Pending ----------
        let pendingPayload =
          (await getJSON(PRIMARY_PENDING)) ?? (await getJSON(FALLBACK_PENDING)); // /pgc/supervision-requests

        // Normalize to an array
        let pendingArray = [];
        if (Array.isArray(pendingPayload?.proposals))
          pendingArray = pendingPayload.proposals;
        else if (Array.isArray(pendingPayload?.assignments))
          pendingArray = pendingPayload.assignments;
        else if (Array.isArray(pendingPayload)) pendingArray = pendingPayload;

        // Choose mapper based on which payload we got
        const pendingRows = pendingPayload?.proposals
          ? pendingArray.map(mapProposalToRow)
          : pendingArray.map(mapSupervisionRequestToRow);

        setPending(pendingRows);

        // ---------- Approved ----------
        let approvedPayload =
          (await getJSON(PRIMARY_APPROVED)) ??
          (await getJSON(FALLBACK_APPROVED)); // /pgc/assigned-supervisors

        let approvedArray = [];
        if (Array.isArray(approvedPayload?.proposals))
          approvedArray = approvedPayload.proposals;
        else if (Array.isArray(approvedPayload?.assignments))
          approvedArray = approvedPayload.assignments;
        else if (Array.isArray(approvedPayload))
          approvedArray = approvedPayload;

        const approvedRows = approvedPayload?.proposals
          ? approvedArray.map(mapProposalToRow)
          : approvedArray.map(mapAssignedSupervisorToRow);

        setApproved(approvedRows);
      } catch (e) {
        console.error("Failed to load data:", e);
        setPending([]);
        setApproved([]);
      }
    };

    load();
  }, []);

  /* -------------------- UI (unchanged) -------------------- */
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Thesis Approvals</h1>

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
            showActions={false}
          />
        )}
      </Card>
    </div>
  );
}

/* ---------- presentational bits (unchanged) ---------- */
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

/* helpers */
function formatDate(d) {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString();
}
