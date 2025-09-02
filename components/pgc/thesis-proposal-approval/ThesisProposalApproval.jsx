"use client";

import { useEffect, useState } from "react";

export default function ThesisApproval() {
  // Data that used to be dummy useMemo
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  // Expansion state (unchanged)
  const [openPendingFor, setOpenPendingFor] = useState(null);
  const [openApprovedFor, setOpenApprovedFor] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const API_BASE = "http://localhost:8080/api";
    // If you add dedicated thesis endpoints later, set these:
    const PRIMARY_PENDING = null; // e.g. `${API_BASE}/pgc/thesis?status=Pending`
    const PRIMARY_APPROVED = null; // e.g. `${API_BASE}/pgc/thesis?status=Approved`

    // Fallbacks that already exist today:
    const FALLBACK_PENDING = `${API_BASE}/pgc/supervision-requests`; // { assignments: [...] }
    const FALLBACK_APPROVED = `${API_BASE}/pgc/assigned-supervisors`; // { assignments: [...] }

    const getJSON = async (url) => {
      if (!url) return null;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        // Softly ignore a 404 so the page still loads
        if (res.status === 404) return null;
        let msg = `Request failed: ${res.status}`;
        try {
          const body = await res.json();
          if (body?.message) msg = body.message;
        } catch {}
        throw new Error(msg);
      }
      return res.json();
    };

    // Map a "supervision request" item → the exact row shape this UI expects
    const mapPendingAssignment = (a) => {
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
        proposedTitle: "-", // not available on this endpoint
        submittedOn: "-", // not available
        researchTopic: "-", // not available
        supervisor: "-", // not available
        objective: "-", // not available
        attachments: "-", // not available
        contact: u.email || "-",
      };
    };

    // Map an "assigned supervisor" item → row shape for approved table
    const mapApprovedAssignment = (a) => {
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
        proposedTitle: "-", // not available here
        submittedOn: "-", // not available
        researchTopic: "-", // not available
        supervisor,
        objective: "-", // not available
        attachments: "-",
        contact: u.email || "-",
      };
    };

    const load = async () => {
      try {
        // Pending
        const pendingPayload =
          (await getJSON(PRIMARY_PENDING)) ?? (await getJSON(FALLBACK_PENDING)); // { assignments: [...] }

        const pendingArray = Array.isArray(pendingPayload?.assignments)
          ? pendingPayload.assignments
          : Array.isArray(pendingPayload)
          ? pendingPayload
          : [];

        setPending(pendingArray.map(mapPendingAssignment));

        // Approved
        const approvedPayload =
          (await getJSON(PRIMARY_APPROVED)) ??
          (await getJSON(FALLBACK_APPROVED)); // { assignments: [...] }

        const approvedArray = Array.isArray(approvedPayload?.assignments)
          ? approvedPayload.assignments
          : Array.isArray(approvedPayload)
          ? approvedPayload
          : [];

        setApproved(approvedArray.map(mapApprovedAssignment));
      } catch (e) {
        console.error("Failed to load thesis approval data:", e);
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

/* -------------------- Reusable bits (unchanged UI) -------------------- */
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
      <td className="px-3 py-2">{value || "-"}</td>
    </tr>
  );
}
