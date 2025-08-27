"use client";

import { useState, useEffect } from "react";

export default function SupervisorPage() {
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
