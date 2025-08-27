"use client";
import { useEffect, useState } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

export default function AdminFacultyPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const res = await fetch(`${API_BASE}/api/admin/faculty`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`GET /api/admin/faculty failed: ${res.status}`);

        const data = await res.json();
        const list = Array.isArray(data?.faculty) ? data.faculty : Array.isArray(data) ? data : [];

        if (!cancelled) setRows(list);
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to fetch faculty");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Loading faculty...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8">All Faculty</h1>

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
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center px-4 py-6">
                    No faculty found.
                  </td>
                </tr>
              ) : (
                rows.map((f, i) => {
                  const d = f.faculty_details || {};
                  const fullName = [f.first_name, f.last_name].filter(Boolean).join(" ") || "-";
                  return (
                    <tr key={f._id || i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3">{i + 1}</td>
                      <td className="px-4 py-3">{fullName}</td>
                      <td className="px-4 py-3">{f.email || "-"}</td>
                      <td className="px-4 py-3">{f.department || "-"}</td>
                      <td className="px-4 py-3">{d.designation || "-"}</td>
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
