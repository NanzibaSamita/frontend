"use client";
import { useEffect, useState } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

export default function AdminFacultyPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // local edits: { [facultyMongoId]: number|string }
  const [edits, setEdits] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [toast, setToast] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 1) Load faculty list (unchanged backend)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`${API_BASE}/api/admin/faculty`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`GET /api/admin/faculty failed: ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data?.faculty) ? data.faculty : Array.isArray(data) ? data : [];

        if (!cancelled) {
          setRows(list);
          // seed inputs with current max
          const seed = {};
          for (const f of list) {
            const id = f?.faculty_details?._id;
            const max = f?.faculty_details?.max_supervision_capacity;
            if (id && typeof max === "number") seed[id] = max;
          }
          setEdits(seed);
        }
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to fetch faculty");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Save capacity via PATCH (as requested)
  async function saveCapacity(facultyId, currentLoad, prevMax) {
    try {
      const raw = edits[facultyId];
      const val = Number(raw);
      if (raw === "" || !Number.isFinite(val) || val < 0) {
        setToast("Capacity must be a non-negative number.");
        return;
      }
      if (val === prevMax) {
        setToast("No changes to save.");
        return;
      }

      setSavingId(facultyId);
      setToast(null);

      const res = await fetch(`${API_BASE}/api/admin/faculty/${facultyId}/max-supervision-cap`, {
        method: "PATCH", // ← using PATCH per your requirement
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ max_supervision_capacity: val }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Update failed: ${res.status}`);

      // refresh the value locally
      setRows(prev =>
        prev.map(f => {
          if (f?.faculty_details?._id === facultyId) {
            return {
              ...f,
              faculty_details: {
                ...f.faculty_details,
                max_supervision_capacity: val,
              },
            };
          }
          return f;
        })
      );
      setToast("Capacity updated ✅");
    } catch (e) {
      setToast(e?.message || "Failed to update capacity");
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-xl">Loading faculty...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-10">
        <div className="flex items-end justify-between mb-2">
          <h1 className="text-3xl font-bold">All Faculty</h1>
          {toast && <p className="text-sm text-gray-700">{toast}</p>}
        </div>

        {err && <p className="mb-3 text-sm text-red-600">{err}</p>}

        <div className="bg-white shadow-md rounded-md w-full max-w-6xl overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Full Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Designation</th>
                <th className="px-4 py-3 font-semibold">Current Load</th>
                <th className="px-4 py-3 font-semibold">Max Capacity</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center px-4 py-6">No faculty found.</td>
                </tr>
              ) : (
                rows.map((f, i) => {
                  const d = f.faculty_details || {};
                  const fullName = [f.first_name, f.last_name].filter(Boolean).join(" ") || "-";
                  const facultyId = d._id; // Faculty doc _id (used by backend)
                  const currentLoad =
                    typeof d.actual_supervision_count === "number"
                      ? d.actual_supervision_count
                      : (typeof d.current_supervision_count === "number" ? d.current_supervision_count : 0);
                  const maxCap = typeof d.max_supervision_capacity === "number" ? d.max_supervision_capacity : 0;
                  const editVal =
                    Object.prototype.hasOwnProperty.call(edits, facultyId) ? edits[facultyId] : maxCap;

                  return (
                    <tr key={f._id || i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3">{i + 1}</td>
                      <td className="px-4 py-3">{fullName}</td>
                      <td className="px-4 py-3">{f.email || "-"}</td>
                      <td className="px-4 py-3">{f.department || "-"}</td>
                      <td className="px-4 py-3">{d.designation || "-"}</td>

                      <td className="px-4 py-3">
                        <span className="font-medium">{currentLoad}</span>
                      </td>

                      <td className="px-4 py-3">
                        {facultyId ? (
                          <input
                            type="number"
                            min={0}
                            className="w-24 px-2 py-1 border rounded"
                            value={editVal}
                            onChange={(e) =>
                              setEdits(prev => ({
                                ...prev,
                                [facultyId]: e.target.value === "" ? "" : Number(e.target.value),
                              }))
                            }
                          />
                        ) : <span className="text-gray-400">—</span>}
                      </td>

                      <td className="px-4 py-3">
                        {facultyId ? (
                          <button
                            className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
                            onClick={() => saveCapacity(facultyId, currentLoad, maxCap)}
                            disabled={
                              savingId === facultyId ||
                              editVal === "" ||
                              Number(editVal) === maxCap ||
                              Number(editVal) < 0
                            }
                          >
                            {savingId === facultyId ? "Saving..." : "Save"}
                          </button>
                        ) : <span className="text-gray-400">—</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
