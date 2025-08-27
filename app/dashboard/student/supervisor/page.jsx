"use client";

import { useEffect, useMemo, useState, useEffect } from "react";

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
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [eligible, setEligible] = useState(false);

  // Fetch available supervisors + eligibility
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // fetch supervisors
        const supRes = await fetch(
          "http://localhost:8080/api/students/supervisor-assignment/available",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const supData = await supRes.json();
        setSupervisors(supData.availableSupervisors || []);

        // fetch eligibility
        const eligRes = await fetch(
          "http://localhost:8080/api/students/check-eligibility",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const eligData = await eligRes.json();
        setEligible(eligData.isEligible || false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setMessage("Failed to load data.");
      }
    };
    fetchData();
  }, []);

  // Handle supervisor select
  const handleSupervisorSelect = (e) => {
    const value = e.target.value;
    setMessage("");

    if (selectedSupervisors.includes(value)) return;

    if (selectedSupervisors.length < 3) {
      setSelectedSupervisors([...selectedSupervisors, value]);
    } else {
      setMessage("You can select up to 3 supervisors.");
    }
  };

  // Remove supervisor
  const handleRemoveSupervisor = (id) => {
    setSelectedSupervisors(selectedSupervisors.filter((sup) => sup !== id));
  };

  // Submit
  const handleSubmit = async () => {
    if (!eligible) {
      setMessage("You are not eligible to submit a thesis proposal (need ≥ 9 credits and CGPA > 2.5).");
      return;
    }

    if (selectedSupervisors.length === 0) {
      setMessage("Please select at least one supervisor.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8080/api/students/supervisor-assignment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            priorityFacultyIds: selectedSupervisors,
          }),
        }
      );

      const data = await res.json();
      console.log(res.data)
      if (!res.ok) {
        setMessage(data.message || "Failed to create assignment.");
      } else {
        setMessage("Assignment request created successfully!");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error creating assignment request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-black mb-8">Select Supervisor(s)</h2>

        {!eligible && (
          <div className="mb-6 p-3 bg-red-50 border border-red-300 text-red-800 rounded-lg">
            You are <strong>not eligible</strong> to submit a thesis proposal (must have ≥ 9 credits).
          </div>
        )}

        {/* Supervisor Dropdown */}
        <div className="flex items-center gap-4">
          <select
            onChange={handleSupervisorSelect}
            className="w-[300px] py-2 px-6 bg-gray-50 border border-gray-300 rounded-md text-black"
            defaultValue=""
            disabled={!eligible}
          >
            <option value="" disabled>
              Select Supervisor
            </option>
            {supervisors.map((sup) => (
              <option key={sup._id} value={sup._id}>
                {sup.user_id.first_name} {sup.user_id.last_name} - {sup.designation}
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
            ))}
          </select>

          <button
            onClick={handleSubmit}
            disabled={loading || !eligible}
            className={`${
              loading || !eligible
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white py-2 px-6 rounded-md`}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
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

        {/* Selected Supervisors (shown in order of selection) */}
        {selectedSupervisors.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {selectedSupervisors.map((id, idx) => {
              const sup = supervisors.find((s) => s._id === id);
              return (
                <div
                  key={id}
                  className="bg-green-100 text-green-800 px-4 py-2 rounded-md flex justify-between items-center"
                >
                  <span>
                    {idx + 1}. {sup ? `${sup.user_id.first_name} ${sup.user_id.last_name}` : "Unknown"}
                  </span>
                  <button
                    className="text-red-600 font-bold"
                    onClick={() => handleRemoveSupervisor(id)}
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Message */}
        {message && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-300 text-blue-800 rounded-lg">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}