"use client";

import { useEffect, useState } from "react";

export default function ThesisProposalApproval() {
  /* -------------------- Data (replaces dummy useMemo) -------------------- */
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  // keep the expansion behavior exactly as-is
  const [openPendingFor, setOpenPendingFor] = useState(null);
  const [openApprovedFor, setOpenApprovedFor] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ---------- Candidate endpoints ----------
    // If you later add explicit proposals endpoints, just fill PRIMARY_* and it will use them first.
    const API_BASE = "http://localhost:8080/api";
    const PRIMARY_PENDING = null; // e.g. `${API_BASE}/pgc/thesis-proposals?status=${encodeURIComponent("Submitted,Under Review,RevisionRequested")}`
    const PRIMARY_APPROVED = null; // e.g. `${API_BASE}/pgc/thesis-proposals?status=${encodeURIComponent("PGCApproved")}`

    // Fallbacks that exist in your backend today (no backend changes needed):
    const FALLBACK_PENDING = `${API_BASE}/pgc/supervision-requests`; // returns { assignments: [...] }
    const FALLBACK_APPROVED = `${API_BASE}/pgc/assigned-supervisors`; // returns { assignments: [...] }

    const getJSON = async (url) => {
      if (!url) return null;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        if (res.status === 404) return null; // softly ignore missing routes
        let msg = `Request failed: ${res.status}`;
        try {
          const payload = await res.json();
          if (payload?.message) msg = payload.message;
        } catch {}
        throw new Error(msg);
      }
      return res.json();
    };

    // ---- Normalize a ThesisProposal -> UI row shape used by this file ----
    const mapProposalToRow = (p) => {
      const stu = p.student_id || {};
      const stuUser = stu.user_id || {};
      const name =
        [stuUser.first_name, stuUser.last_name].filter(Boolean).join(" ") ||
        "-";
      const id = stu.student_number || p.student_number || p.id || "-";
      const program =
        stu.program_id?.program_name && stu.program_id?.degree_type
          ? `${stu.program_id.program_name} (${stu.program_id.degree_type})`
          : stu.program_id || "—";

      const sup = p.supervisor_id || {};
      const supUser = sup.user_id || {};
      const supervisor =
        [supUser.first_name, supUser.last_name].filter(Boolean).join(" ") ||
        "-";

      const title = p.title || "-";
      const researchTopic = p.research_topic || "-";
      const objective = p.objective || "-";
      const attachments = p.attachment
        ? [{ label: p.attachment, url: "#" }]
        : Array.isArray(p.attachments)
        ? p.attachments
        : [];
      const submittedOn = formatDate(
        p.createdAt || p.created_at || p.submittedOn
      );
      const requestedOn = formatDate(
        p.requestedOn || p.createdAt || p.created_at
      );
      const contact = stuUser.email || "-";

      return {
        id: String(id),
        name,
        program,
        title,
        submittedOn,
        requestedOn,
        researchTopic,
        supervisor,
        objective,
        attachments,
        contact,
        _raw: p,
      };
    };

    // ---- Fallback maps for supervision endpoints (no proposal fields available) ----
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
        title: "-", // not present on this endpoint
        submittedOn: "-", // not present
        requestedOn: "-", // not present
        researchTopic: "-",
        supervisor: "-",
        objective: "-",
        attachments: [],
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
        title: "-", // no thesis title here
        submittedOn: "-", // not present
        requestedOn: "-", // not present
        researchTopic: "-",
        supervisor,
        objective: "-",
        attachments: [],
        contact: u.email || "-",
        _raw: a,
      };
    };

    const load = async () => {
      try {
        // PENDING
        let pendingPayload =
          (await getJSON(PRIMARY_PENDING)) ?? (await getJSON(FALLBACK_PENDING)); // { assignments: [...] }

        let pendingArray = [];
        if (Array.isArray(pendingPayload?.proposals))
          pendingArray = pendingPayload.proposals;
        else if (Array.isArray(pendingPayload?.assignments))
          pendingArray = pendingPayload.assignments;
        else if (Array.isArray(pendingPayload)) pendingArray = pendingPayload;

        const pendingRows = pendingPayload?.proposals
          ? pendingArray.map(mapProposalToRow)
          : pendingArray.map(mapSupervisionRequestToRow);

        setPending(pendingRows);

        // APPROVED
        let approvedPayload =
          (await getJSON(PRIMARY_APPROVED)) ??
          (await getJSON(FALLBACK_APPROVED)); // { assignments: [...] }

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
        console.error("Failed to load proposals:", e);
        setPending([]);
        setApproved([]);
      }
    };

    load();
  }, []);

  /* -------------------- Render (UI unchanged) -------------------- */
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
            showActions={false}
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

/* ==================== Details Block (unchanged UI) ==================== */
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

/* ==================== Small UI helpers (unchanged) ==================== */
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

/* -------------------- helpers -------------------- */
function formatDate(d) {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString();
}
