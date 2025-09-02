"use client";

import React, { useEffect, useMemo, useState } from "react";
import ThesisApprovalDetails from "./ThesisApprovalDetails";

const API_BASE = "http://localhost:8080/api";
const API_ORIGIN = "http://localhost:8080"; // for /uploads/<file>

export default function ThesisApprovalList() {
  const [expandedId, setExpandedId] = useState(null);
  const [all, setAll] = useState([]); // raw mapped rows from backend
  const [loading, setLoading] = useState(true);

  const toggleDetails = (id) => {
    setExpandedId((cur) => (cur === id ? null : id));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Try multiple possible routes so we don't have to touch the backend.
    const CANDIDATE_LIST_URLS = [
      `${API_BASE}/faculty/proposals-from-supervised`, // common
      `${API_BASE}/faculty/proposals-from-supervised-students`, // alt
      `${API_BASE}/faculty/proposals`, // alt
    ];

    const getFirstWorking = async (urls) => {
      for (const url of urls) {
        try {
          const res = await fetch(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (!res.ok) {
            if (res.status === 404) continue;
            // bubble other errors
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.message || `Request failed: ${res.status}`);
          }
          const data = await res.json();
          return data;
        } catch (_) {
          // try next
        }
      }
      return null;
    };

    const mapProposalToRow = (p) => {
      const stu = p.student_id || {};
      const stuUser = stu.user_id || {};

      const name =
        [stuUser.first_name, stuUser.last_name].filter(Boolean).join(" ") ||
        "-";

      const studentId = stu.student_number || "-";

      const program =
        typeof stu.program_id === "object"
          ? [
              stu.program_id?.program_name,
              stu.program_id?.degree_type
                ? `(${stu.program_id.degree_type})`
                : null,
            ]
              .filter(Boolean)
              .join(" ")
          : stu.program_id || "—";

      const title = p.title || "-";
      const date = formatDate(p.createdAt || p.created_at);

      const area = p.research_topic || "-";
      const motivation = p.objective || "-";
      const contact = stuUser.email || "-";

      // if attachment exists, link to static /uploads/<filename>
      const attachmentFile = p.attachment || null;
      const attachmentUrl = attachmentFile
        ? `${API_ORIGIN}/uploads/${encodeURIComponent(attachmentFile)}`
        : null;

      return {
        // keep everything the UI already uses
        id: String(p._id || studentId || title || Math.random()),
        _proposalId: p._id, // for actions
        name,
        studentId,
        program,
        title,
        date,
        area,
        motivation,
        contact,
        attachment: attachmentFile || "-", // text the UI shows
        attachmentUrl, // real link for download
        status: p.status, // to split into pending/approved
      };
    };

    (async () => {
      try {
        const payload = await getFirstWorking(CANDIDATE_LIST_URLS);
        // Controller returns an array of proposals
        // (we coded getProposalsFromSupervisedStudents to return an array)
        // If it returns { proposals: [...] }, normalize:
        const proposals = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.proposals)
          ? payload.proposals
          : [];

        setAll(proposals.map(mapProposalToRow));
      } catch (e) {
        console.error("Failed to load supervisor proposals:", e);
        setAll([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pendingTheses = useMemo(
    () =>
      all.filter((t) =>
        ["Submitted", "Under Review", "RevisionRequested"].includes(
          String(t.status || "")
        )
      ),
    [all]
  );

  const approvedTheses = useMemo(
    () =>
      all.filter((t) =>
        ["Approved", "PGCApproved"].includes(String(t.status || ""))
      ),
    [all]
  );

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <div className="text-sm text-gray-600">Loading…</div>
      </div>
    );
  }

  const renderTable = (theses, label) => (
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
            {theses.map((t) => (
              <React.Fragment key={t.id}>
                <tr className="border-t border-gray-200">
                  <td className="px-6 py-3">{t.name}</td>
                  <td className="px-6 py-3">{t.studentId}</td>
                  <td className="px-6 py-3">{t.program}</td>
                  <td className="px-6 py-3">{t.title}</td>
                  <td className="px-6 py-3">{t.date}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => toggleDetails(t.id)}
                      className={`text-sm px-4 py-1.5 rounded transition ${
                        expandedId === t.id
                          ? "bg-blue-100 text-black"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {expandedId === t.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {expandedId === t.id && (
                  <tr className="border-t border-gray-100">
                    <td colSpan={6} className="px-6 py-4 bg-gray-50">
                      <ThesisApprovalDetails
                        thesis={t}
                        onComment={async () => {
                          const feedback = prompt("Write a comment:");
                          if (!feedback) return;
                          await postReview(t._proposalId, "Comment", feedback);
                        }}
                        onApprove={async () => {
                          await postReview(t._proposalId, "Approved");
                          // Move from pending to approved locally
                          setAll((prev) =>
                            prev.map((x) =>
                              x.id === t.id ? { ...x, status: "Approved" } : x
                            )
                          );
                        }}
                        onReject={async () => {
                          const feedback =
                            prompt("Reason for rejection (optional):") || "";
                          await postReview(t._proposalId, "Rejected", feedback);
                          // After reject, keep it visible but status changes
                          setAll((prev) =>
                            prev.map((x) =>
                              x.id === t.id ? { ...x, status: "Rejected" } : x
                            )
                          );
                        }}
                      />
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

  async function postReview(proposalId, status, feedback = "") {
    if (!proposalId) return;
    const token = localStorage.getItem("token");

    const CANDIDATE_REVIEW_URLS = [
      `${API_BASE}/faculty/review-proposal`, // matches controller name
      `${API_BASE}/faculty/proposals/review`, // alt
      `${API_BASE}/faculty/proposal/review`, // alt
    ];

    let lastErr;
    for (const url of CANDIDATE_REVIEW_URLS) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ proposalId, status, feedback }),
        });
        if (!res.ok) {
          if (res.status === 404) {
            continue; // try next candidate
          }
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message || `Request failed: ${res.status}`);
        }
        return await res.json();
      } catch (e) {
        lastErr = e;
      }
    }
    console.error("Review failed:", lastErr);
    alert(lastErr?.message || "Failed to submit review");
  }

  return (
    <div className="space-y-10">
      {renderTable(pendingTheses, "Pending Thesis")}
      {renderTable(approvedTheses, "Approved Thesis")}
    </div>
  );
}

/* helpers */
function formatDate(d) {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString();
}
