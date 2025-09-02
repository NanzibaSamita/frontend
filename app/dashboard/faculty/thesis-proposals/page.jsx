"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FileText, MessageCircle, CheckCircle, XCircle } from "lucide-react";

export default function ThesisProposalApprovalsPage() {
  const [proposals, setProposals] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [feedbackMap, setFeedbackMap] = useState({});

  // keep this constant; don't put it in a dependency array
  const API_BASE = "http://localhost:8080";

  const getAuthHeaders = () => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ✅ dependency array is constant []
  useEffect(() => {
    let mounted = true;

    const fetchProposals = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE}/api/faculty/thesis-proposals`,
          { headers: getAuthHeaders() }
        );
        if (mounted) setProposals(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching proposals", err);
        if (mounted) setProposals([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProposals();
    return () => {
      mounted = false;
    };
  }, []); // ← constant length; error disappears

  const fmtDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString();
  };

  const isActionable = (status) =>
    ["Submitted", "Under Review", "RevisionRequested"].includes(status);

  // Build a robust /uploads URL
  const buildAttachmentUrl = (attachment) => {
    if (!attachment) return null;
    if (/^https?:\/\//i.test(attachment)) return attachment;

    let p = String(attachment).replace(/\\/g, "/").trim();
    if (!p.startsWith("/uploads") && !p.startsWith("uploads/")) {
      p = `/uploads/${p.replace(/^\/+/, "")}`;
    } else {
      p = `/${p.replace(/^\/+/, "")}`;
    }
    return `${API_BASE}${p}`;
  };

  // Protected (token) fallback for opening the PDF
  const openProtectedProposalPdf = async (proposalId) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(
        `${API_BASE}/api/students/proposal-pdf/${proposalId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!resp.ok) throw new Error(`Download failed (${resp.status})`);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      console.error("Protected PDF open failed:", e);
      alert("Could not open the file.");
    }
  };

  const handleReview = async (proposalId, status) => {
    const feedback = (feedbackMap[proposalId] || "").trim();
    if (status === "Rejected" && !feedback) {
      alert("Feedback is required when rejecting.");
      return;
    }

    try {
      setBusyId(proposalId);
      const res = await axios.post(
        `${API_BASE}/api/faculty/thesis-proposal/review`,
        { proposalId, feedback, status },
        { headers: getAuthHeaders() }
      );

      const updated = res?.data?.proposal;
      if (!updated?._id) throw new Error("Invalid server response");

      setProposals((prev) =>
        prev.map((p) => (p._id === proposalId ? updated : p))
      );
      setFeedbackMap((m) => ({ ...m, [proposalId]: "" }));
    } catch (err) {
      console.error("Error reviewing proposal", err);
      alert(err?.response?.data?.message || "Review failed.");
    } finally {
      setBusyId(null);
    }
  };

  const Row = ({ p }) => {
    const stu = p.student_id || {};
    const u = stu.user_id || {};
    const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "N/A";
    const sid = stu.student_number || "N/A";
    const program =
      (stu.program_id &&
      typeof stu.program_id === "object" &&
      stu.program_id.program_name
        ? `${stu.program_id.program_name}${
            stu.program_id.degree_type ? ` (${stu.program_id.degree_type})` : ""
          }`
        : stu.program_id) || "N/A";

    const decided = !isActionable(p.status);
    const busy = busyId === p._id;
    const publicUrl = buildAttachmentUrl(p.attachment);

    const onAttachmentClick = async (e) => {
      if (!publicUrl) {
        e.preventDefault();
        await openProtectedProposalPdf(p._id);
      }
    };

    return (
      <>
        <tr className="border-t border-gray-200">
          <td className="px-6 py-3">{name}</td>
          <td className="px-6 py-3">{sid}</td>
          <td className="px-6 py-3">{program}</td>
          <td className="px-6 py-3">{p.title || "—"}</td>
          <td className="px-6 py-3">{fmtDate(p.createdAt || p.created_at)}</td>
          <td className="px-6 py-3">{p.status || "—"}</td>
          <td className="px-6 py-3 text-right">
            <button
              onClick={() => setExpandedId(expandedId === p._id ? null : p._id)}
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
              <div className="border rounded-xl p-6 shadow-sm bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                    <p className="text-gray-700">{sid}</p>
                    <p className="text-sm font-medium text-blue-600 bg-blue-100 px-2 inline-block mt-1 rounded">
                      {program}
                    </p>
                  </div>
                  <p className="text-gray-500 font-medium">
                    Submitted: {fmtDate(p.createdAt || p.created_at)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 text-gray-800">
                  <div>
                    <p className="font-semibold">Research Topic:</p>
                    <p className="text-gray-500">{p.research_topic || "N/A"}</p>

                    <p className="font-semibold mt-4">Title:</p>
                    <p className="text-gray-500">{p.title || "—"}</p>

                    <p className="font-semibold mt-4">Attachment</p>
                    {p.attachment ? (
                      <a
                        href={publicUrl || "#"}
                        onClick={onAttachmentClick}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 flex items-center gap-1 mt-1"
                      >
                        <FileText size={16} />
                        Proposal File
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold">Objective</p>
                    <p className="text-gray-500">{p.objective || "N/A"}</p>

                    <p className="font-semibold mt-4">Contact:</p>
                    <p className="text-gray-500">{u.email || "N/A"}</p>
                  </div>
                </div>

                {!decided && (
                  <div className="mt-4">
                    <textarea
                      value={feedbackMap[p._id] ?? ""}
                      onChange={(e) =>
                        setFeedbackMap((m) => ({
                          ...m,
                          [p._id]: e.target.value,
                        }))
                      }
                      placeholder="Add feedback (required if rejecting)"
                      className="w-full border rounded-md p-3"
                      rows={3}
                    />
                  </div>
                )}

                {!decided ? (
                  <div className="mt-6 flex gap-4">
                    <button
                      disabled={busy}
                      className={`bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 ${
                        busy ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => alert("Comment")}
                    >
                      <MessageCircle size={16} />
                      Comment
                    </button>

                    <button
                      disabled={busy}
                      onClick={() => handleReview(p._id, "Approved")}
                      className={`bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 ${
                        busy ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <CheckCircle size={16} />
                      {busy ? "Approving..." : "Approve"}
                    </button>

                    <button
                      disabled={busy}
                      onClick={() => handleReview(p._id, "Rejected")}
                      className={`bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-700 ${
                        busy ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <XCircle size={16} />
                      {busy ? "Rejecting..." : "Reject"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 text-sm text-gray-500 italic">
                    This proposal is <strong>{p.status}</strong>; actions are
                    locked.
                  </div>
                )}
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Thesis Proposal Approvals
      </h1>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-10 py-8">
        {loading ? (
          <p>Loading proposals...</p>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Thesis Proposals
            </h3>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
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
                    <Row key={p._id} p={p} />
                  ))}
                  {proposals.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No proposals found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
