"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

export default function SupervisorPage() {
  const [loadingAvail, setLoadingAvail] = useState(true);
  const [loadingFaculty, setLoadingFaculty] = useState(true);
  const [error, setError] = useState(null);

  const [supervisors, setSupervisors] = useState([]); // from /available
  const [facultyByUserId, setFacultyByUserId] = useState({}); // map of faculty.user_id → Faculty

  const [selectedFacultyUserId, setSelectedFacultyUserId] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);
  const [supervisorStatus, setSupervisorStatus] = useState("Not Selected");

  const loading = loadingAvail || loadingFaculty;

  // 1) fetch available supervisors
  useEffect(() => {
    let cancelled = false;
    async function fetchAvailable() {
      try {
        setLoadingAvail(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/supervisorAssignment/available`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`GET /available failed: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          const list = Array.isArray(data?.availableSupervisors) ? data.availableSupervisors : [];
          setSupervisors(list);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load supervisors.");
      } finally {
        if (!cancelled) setLoadingAvail(false);
      }
    }
    fetchAvailable();
    return () => { cancelled = true; };
  }, []);

  // 2) fetch all faculties
  useEffect(() => {
    let cancelled = false;
    async function fetchFaculties() {
      try {
        setLoadingFaculty(true);
        const res = await fetch(`${API_BASE}/api/admin/faculty`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`GET /admin/faculty failed: ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data?.faculty) ? data.faculty : [];
        const byUserId = {};
        for (const f of list) {
          if (f && f.user_id) byUserId[f.user_id] = f;
        }
        if (!cancelled) setFacultyByUserId(byUserId);
      } catch (e) {
        if (!cancelled) setError((prev) => prev ?? e?.message ?? "Failed to load faculties.");
      } finally {
        if (!cancelled) setLoadingFaculty(false);
      }
    }
    fetchFaculties();
    return () => { cancelled = true; };
  }, []);

  const selectedFaculty = useMemo(() => facultyByUserId[selectedFacultyUserId], [facultyByUserId, selectedFacultyUserId]);

  // 3) submit create-assignment
  async function handleCreate() {
    try {
      setSubmitStatus(null);
      if (!selectedFacultyUserId) {
        setSubmitStatus("Please select a supervisor first.");
        return;
      }
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setSubmitStatus("Missing auth token. Please log in.");
        return;
      }
      const res = await fetch(`${API_BASE}/api/supervisorAssignment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priorityFacultyIds: [selectedFaculty?._id] }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `POST /create failed: ${res.status}`);
      setSupervisorStatus("Selected");
      setSubmitStatus("Request submitted successfully.");
    } catch (e) {
      setSubmitStatus(e?.message || "Failed to submit request.");
    }
  }

  return (
    <main className="flex-1 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-black mb-8">Supervisor</h2>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">Select Supervisor</label>

            <select
              className="w-full max-w-xs py-2 px-3 bg-gray-50 border border-gray-300 rounded-md text-black"
              value={selectedFacultyUserId}
              onChange={(e) => {
                setSelectedFacultyUserId(e.target.value);
                setSupervisorStatus("Selected");
              }}
              disabled={loading || !!error || supervisors.length === 0}
            >
              <option value="" disabled>
                {loading ? "Loading..." : "Select Supervisor"}
              </option>
              {supervisors.map((s) => {
                const fac = facultyByUserId[s?.user_id]; // match supervisor.user_id with faculty.user_id
                const label = fac
                  ? `${fac.first_name} ${fac.last_name}${fac.faculty_details?.designation ? ` — ${fac.faculty_details.designation}` : ""}`
                  : s?.user_id;
                return (
                  <option key={s?.user_id} value={s?.user_id}>
                    {label}
                  </option>
                );
              })}
            </select>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {!error && !loading && supervisors.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">No supervisors currently available.</p>
            )}
          </div>

          <button
            onClick={handleCreate}
            className="bg-green-600 text-white py-2 px-6 rounded-md disabled:opacity-50"
            disabled={!selectedFacultyUserId}
          >
            {supervisorStatus === "Not Selected" ? "Select" : "Send Request"}
          </button>
        </div>

        {submitStatus && (
          <p
            className={`mt-3 text-sm ${submitStatus.toLowerCase().includes("success") ? "text-green-700" : "text-red-600"}`}
          >
            {submitStatus}
          </p>
        )}
      </div>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg text-gray-800 font-semibold">Supervisor Status</span>
          <span className="text-lg text-gray-600">
            {supervisorStatus === "Not Selected"
              ? "Not Selected"
              : selectedFaculty
              ? `${selectedFaculty.first_name} ${selectedFaculty.last_name}${selectedFaculty.faculty_details?.designation ? ` — ${selectedFaculty.faculty_details.designation}` : ""}`
              : "Selected"}
          </span>
        </div>
      </div>
    </main>
  );
}