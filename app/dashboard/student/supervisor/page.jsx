"use client";

import { useState, useEffect } from "react";

export default function SupervisorPage() {
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]); // allow multiple selection
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch available supervisors
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/students/supervisor-assignment/available"
        );
        const data = await res.json();
        setSupervisors(data.availableSupervisors || []);
      } catch (err) {
        console.error("Error fetching supervisors:", err);
        setMessage("Failed to load supervisors.");
      }
    };
    fetchSupervisors();
  }, []);

  // Handle selection (multi-select up to 3)
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

  const handleRemoveSupervisor = (id) => {
    setSelectedSupervisors(selectedSupervisors.filter((sup) => sup !== id));
  };

  // Submit assignment request
  const handleSubmit = async () => {
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

        {/* Supervisor Dropdown */}
        <div className="flex items-center gap-4">
          <select
            onChange={handleSupervisorSelect}
            className="w-[300px] py-2 px-6 bg-gray-50 border border-gray-300 rounded-md text-black"
            defaultValue=""
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
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white py-2 px-6 rounded-md`}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>

        {/* Selected Supervisors */}
        {selectedSupervisors.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedSupervisors.map((id) => {
              const sup = supervisors.find((s) => s._id === id);
              return (
                <span
                  key={id}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full cursor-pointer"
                  onClick={() => handleRemoveSupervisor(id)}
                  title="Click to remove"
                >
                  {sup ? `${sup.user_id.first_name} ${sup.user_id.last_name}` : "Unknown"}
                  &times;
                </span>
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
