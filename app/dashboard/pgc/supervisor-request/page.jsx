"use client";

import { useEffect, useMemo, useState } from "react";
import PgcSidebar from "@/components/PgcSidebar";

function Pill({ children, tone = "gray" }) {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export default function PgcRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [actioningId, setActioningId] = useState(null);
  const [query, setQuery] = useState("");

  // ---- Fetch requests on mount
  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated. Please login.");

        const res = await fetch(
          "http://localhost:8080/api/pgc/requests", // TODO: set your API
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          let msg = "Failed to load requests";
          try {
            const j = await res.json();
            if (j?.message) msg = j.message;
          } catch {}
          throw new Error(msg);
        }
        const data = await res.json();
        // Expecting an array. Shape example for each item:
        // {
        //   _id: "...",
        //   status: "Pending" | "Approved" | "Rejected",
        //   createdAt: "...",
        //   student: { full_name, student_number, department, email, cgpa, program, current_semester },
        //   supervisor: { full_name, department, email, domain, current_supervision_count, max_supervision_capacity }
        // }
        setRequests(Array.isArray(data) ? data : data?.requests ?? []);
      } catch (err) {
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter((r) => {
      const s = r?.student || {};
      const f = r?.supervisor || {};
      return (
        s?.full_name?.toLowerCase().includes(q) ||
        s?.student_number?.toLowerCase?.().includes(q) ||
        s?.department?.toLowerCase?.().includes(q) ||
        f?.full_name?.toLowerCase().includes(q) ||
        f?.department?.toLowerCase?.().includes(q) ||
        f?.domain?.toLowerCase?.().includes(q)
      );
    });
  }, [requests, query]);

  const takeAction = async (id, action) => {
    try {
      setActioningId(id);
      const token = localStorage.getItem("token");
      const url =
        action === "approve"
          ? `http://localhost:8080/api/pgc/requests/${id}/approve` // TODO: set your API
          : `http://localhost:8080/api/pgc/requests/${id}/reject`; // TODO: set your API

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: action === "reject" ? "Not suitable" : undefined }),
      });

      if (!res.ok) {
        let msg = `Failed to ${action}`;
        try {
          const j = await res.json();
          if (j?.message) msg = j.message;
        } catch {}
        throw new Error(msg);
      }

      // Optimistically update local state
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: action === "approve" ? "Approved" : "Rejected" } : r))
      );
    } catch (e) {
      alert(e.message);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex">
      <PgcSidebar />

      <main className="flex-1 p-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Supervisor Requests</h1>
            <p className="text-sm text-gray-500">
              Review requests and approve or reject after checking advisor load and domain fit.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search student/supervisor/department"
              className="w-72 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </header>

        {loading && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-gray-600">
            Loading requests…
          </div>
        )}

        {error && !loading && (
          <div className="bg-white border border-red-200 rounded-lg p-6">
            <div className="text-red-600 font-semibold mb-1">Error</div>
            <div className="text-sm">{error}</div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-4">
            {filtered.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-gray-600">
                No requests found.
              </div>
            ) : (
              filtered.map((r) => {
                const s = r?.student || {};
                const f = r?.supervisor || {};
                const capacity =
                  typeof f?.current_supervision_count === "number" &&
                  typeof f?.max_supervision_capacity === "number"
                    ? `${f.current_supervision_count}/${f.max_supervision_capacity}`
                    : "—";

                const overCap =
                  typeof f?.current_supervision_count === "number" &&
                  typeof f?.max_supervision_capacity === "number" &&
                  f.current_supervision_count >= f.max_supervision_capacity;

                return (
                  <div key={r._id} className="bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Pill tone={r.status === "Pending" ? "amber" : r.status === "Approved" ? "green" : "red"}>
                          {r.status || "Pending"}
                        </Pill>
                        <span className="text-sm text-gray-500">
                          Req ID: <span className="font-mono">{r._id?.slice(-8)}</span>
                        </span>
                        {overCap ? <Pill tone="red">Over capacity</Pill> : <Pill tone="blue">Load {capacity}</Pill>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={actioningId === r._id || r.status === "Approved"}
                          onClick={() => takeAction(r._id, "approve")}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition
                            ${
                              actioningId === r._id || r.status === "Approved"
                                ? "bg-green-200 text-white cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                        >
                          {actioningId === r._id ? "Processing…" : "Approve"}
                        </button>
                        <button
                          disabled={actioningId === r._id || r.status === "Rejected"}
                          onClick={() => takeAction(r._id, "reject")}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition
                            ${
                              actioningId === r._id || r.status === "Rejected"
                                ? "bg-red-200 text-white cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                    {/* side-by-side info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4 p-4">
                      {/* Student */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-3">Student</h3>
                        <table className="w-full text-sm">
                          <tbody className="[&>tr>td]:py-1.5">
                            <tr>
                              <td className="text-gray-500">Name</td>
                              <td className="text-right text-gray-800 font-medium">{s.full_name || "—"}</td>
                            </tr>
                            <tr>
                              <td className="text-gray-500">Student No.</td>
                              <td className="text-right text-gray-800 font-medium">{s.student_number || "—"}</td>
                            </tr>
                            <tr>
                              <td className="text-gray-500">Department</td>
                              <td className="text-right text-gray-800">{s.department || "—"}</td>
                            </tr>
                            <tr>
                              <td className="text-gray-500">Program</td>
                              <td className="text-right text-gray-800">{s.program || "—"}</td>
                            </tr>
                            <tr>
                              <td className="text-gray-500">CGPA</td>
                              <td className="text-right text-gray-800">{s.cgpa ?? "—"}</td>
                            </tr>
                            <tr>
                              <td className="text-gray-500">Current Sem</td>
                              <td className="text-right text-gray-800">{s.current_semester ?? "—"}</td>
                            </tr>
                            <tr>
                              <td className="text-gray-500">Email</td>
                              <td className="text-right text-gray-800">{s.email || "—"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Supervisor */}
                      <div className="p-4 md:border-l md:border-gray-200">
                        <h3 className="text-lg font-semibold mb-3">Requested Supervisor</h3>
                        <table className="w-full text-sm">
                          <tbody className="[&>tr>td]:py-1.5">
                            <tr>
                              <td className="text-gray-500">Name</td>
                              <td className="text-right text-gray-800 font-medium">{f.full_name || "—"}</td>
                            </tr>
                            <tr>
                              <td className="text-gray-500">Department</td>
                              <td className="text-right text-gray-800">{f.department || "—"}</td>
                            </tr>
                            <tr>
                              <td className="text-gray-500">Domain</td>
                              <td className="text-right text-gray-800">{f.domain || "—"}</td>
                            </tr>
                            <tr>
                              <td className="text-gray-500">Email</td>
                              <td className="text-right text-gray-800">{f.email || "—"}</td>
                            </tr>
                            <tr>
                              <td className="text-gray-500">Supervision Load</td>
                              <td className="text-right text-gray-800">
                                {typeof f.current_supervision_count === "number" &&
                                typeof f.max_supervision_capacity === "number"
                                  ? `${f.current_supervision_count}/${f.max_supervision_capacity}`
                                  : "—"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}
