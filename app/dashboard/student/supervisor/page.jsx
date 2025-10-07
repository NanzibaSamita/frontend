"use client";

import { useState, useEffect, useRef } from "react";

export default function SupervisorPage() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  const [supervisors, setSupervisors] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [pageState, setPageState] = useState("loading"); // loading, not_assigned, pending, assigned

  // Avoid double-running effects in React 18 Strict Mode (dev)
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return; // guard in dev
    hasFetchedRef.current = true;

    const ac = new AbortController();

    const fetchData = async () => {
      try {
        setPageLoading(true);
        const token = localStorage.getItem("token");
        const commonHeaders = token
          ? { Authorization: `Bearer ${token}` }
          : undefined;

        // 1) Check for existing assignment
        const assignRes = await fetch(
          `${API}/api/students/assignment/check-status`,
          { headers: commonHeaders, signal: ac.signal }
        );

        if (assignRes.ok) {
          // Be defensive about JSON shape
          const assignData = await assignRes
            .json()
            .catch(() => ({ assignment: null }));
          const assn = assignData?.assignment ?? null;
          setAssignment(assn);

          if (assn && assn.overall_status === "Assigned") {
            setPageState("assigned");
          } else if (assn) {
            setPageState("pending");
          } else {
            // No assignment object returned, treat as not assigned
            await loadEligibilityAndSupervisors({ headers: commonHeaders, signal: ac.signal });
            setPageState("not_assigned");
          }
        } else if (assignRes.status === 404) {
          // Explicitly handle 404 as "no assignment yet"
          await loadEligibilityAndSupervisors({ headers: commonHeaders, signal: ac.signal });
          setPageState("not_assigned");
        } else {
          // Other server errors
          const text = await assignRes.text().catch(() => "");
          throw new Error(`Assignment check failed: ${assignRes.status} ${text}`);
        }
      } catch (err) {
        if (ac.signal.aborted) return;
        console.error("Error fetching data:", err);
        setMessage("Failed to load data.");
        setPageState("not_assigned");
      } finally {
        if (!ac.signal.aborted) setPageLoading(false);
      }
    };

    const loadEligibilityAndSupervisors = async (init) => {
      // 2) Eligibility
      const eligRes = await fetch(
        `${API}/api/students/supervisor-assignment/check-eligibility`,
        init
      );
      const eligData = await eligRes
        .json()
        .catch(() => ({ isEligible: false }));
      setEligible(Boolean(eligData?.isEligible));

      // 3) Available supervisors
      const supRes = await fetch(
        `${API}/api/students/supervisor-assignment/available`,
        init
      );
      const supData = await supRes
        .json()
        .catch(() => ({ availableSupervisors: [] }));
      const list = Array.isArray(supData?.availableSupervisors)
        ? supData.availableSupervisors.filter(Boolean)
        : [];
      setSupervisors(list);
    };

    fetchData();

    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSupervisorSelect = (e) => {
    const value = e.target.value;
    setMessage("");

    if (!value) return;
    if (selectedSupervisors.includes(value)) return;
    if (selectedSupervisors.length < 3) {
      setSelectedSupervisors((prev) => [...prev, value]);
    } else {
      setMessage("You can select up to 3 supervisors.");
    }
  };

  const handleRemoveSupervisor = (id) => {
    setSelectedSupervisors((prev) => prev.filter((sup) => sup !== id));
  };

  const handleSubmit = async () => {
    if (!eligible) {
      setMessage("You are not eligible (need ≥ 9 credits).");
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
        `${API}/api/students/supervisor-assignment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ priorityFacultyIds: selectedSupervisors }),
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data?.message || "Failed to create assignment.");
      } else {
        setMessage("Supervisor Assignment Request Created!");
        // Refresh to show pending state
        if (typeof window !== "undefined") window.location.reload();
      }
    } catch (err) {
      console.error(err);
      setMessage("Error creating assignment request.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-black mb-8">
          Supervisor Assignment
        </h2>

        {/* State 1: No assignment exists - show selection form */}
        {pageState === "not_assigned" && (
          <>
            {!eligible && (
              <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-800 rounded-lg">
                <strong>Not Eligible:</strong> You need at least 9 credits to request a supervisor.
              </div>
            )}

            {eligible && (
              <div className="mb-6 p-4 bg-green-50 border border-green-300 text-green-800 rounded-lg">
                <strong>Eligible:</strong> You can now request supervisor assignment.
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Select Supervisors (Priority Order)</h3>
              <div className="flex items-center gap-4">
                <select
                  onChange={handleSupervisorSelect}
                  className="w-[400px] py-2 px-4 bg-gray-50 border border-gray-300 rounded-md text-black"
                  defaultValue=""
                  disabled={!eligible}
                >
                  <option value="" disabled>
                    Select Supervisor
                  </option>
                  {supervisors.map((sup) => {
                    const u = sup?.user_id || {};
                    const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "Unnamed";
                    return (
                      <option key={sup?._id} value={sup?._id}>
                        {name} - {sup?.designation || "N/A"} ({sup?.current_supervision_count ?? 0}/{sup?.max_supervision_capacity ?? 0})
                      </option>
                    );
                  })}
                </select>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !eligible || selectedSupervisors.length === 0}
                  className={`${
                    loading || !eligible || selectedSupervisors.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white py-2 px-6 rounded-md`}
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </div>

            {/* Selected supervisors list */}
            {selectedSupervisors.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Selected Priority List:</h4>
                <div className="space-y-2">
                  {selectedSupervisors.map((id, idx) => {
                    const sup = supervisors.find((s) => s?._id === id);
                    const u = sup?.user_id || {};
                    const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "Unknown";
                    return (
                      <div
                        key={id}
                        className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md flex justify-between items-center"
                      >
                        <span>
                          <strong>Priority {idx + 1}:</strong> {name} - {sup?.designation || "N/A"}
                        </span>
                        <button
                          className="text-red-600 hover:text-red-800 font-bold text-lg"
                          onClick={() => handleRemoveSupervisor(id)}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* State 2: Assignment exists but pending - show priority list and status */}
        {pageState === "pending" && assignment && (
          <div>
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg">
              <strong>Status:</strong> {assignment?.overall_status} - Waiting for supervisor and PGC approval
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Your Priority List</h3>
              <div className="space-y-3">
                {Array.isArray(assignment?.priority_list) &&
                  assignment.priority_list.map((p, idx) => {
                    const faculty = p?.faculty_id || {};
                    const u = faculty?.user_id || {};
                    const isCurrentPriority = idx === (assignment?.current_priority_index ?? -1);
                    const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "Unknown";

                    return (
                      <div
                        key={p?._id || idx}
                        className={`p-4 border rounded-lg ${
                          isCurrentPriority ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">Priority {idx + 1}: {name}</h4>
                            <p className="text-sm text-gray-800 mt-1">
                              {faculty?.designation || "N/A"} | {faculty?.specialization || "N/A"}
                            </p>
                            <p className="text-sm text-gray-800">Department: {u?.department || "N/A"}</p>
                            {faculty?.research_interests && (
                              <p className="text-sm text-gray-700 mt-1">Research: {faculty.research_interests}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block px-3 py-1 text-xs rounded-full ${
                                p?.status === "SupervisorAccepted"
                                  ? "bg-green-100 text-green-800"
                                  : p?.status === "Requested"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : p?.status === "SupervisorRejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {(p?.status || "Unknown").replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            {isCurrentPriority && (
                              <div className="text-xs text-blue-600 mt-1 font-semibold">Current Priority</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-2">What happens next?</h4>
              <ol className="text-sm text-gray-700 space-y-1">
                <li>1. Supervisor reviews and responds to your request</li>
                <li>2. If accepted by supervisor, PGC will review and approve/reject</li>
                <li>3. If rejected, the system moves to your next priority choice</li>
                <li>4. You'll be notified once a supervisor is assigned</li>
              </ol>
            </div>
          </div>
        )}

        {/* State 3: Supervisor assigned - show supervisor details */}
        {pageState === "assigned" && assignment && (
          <div>
            <div className="mb-6 p-4 bg-green-50 border border-green-300 text-green-800 rounded-lg">
              <strong>Congratulations!</strong> Your supervisor has been assigned.
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h3 className="text-gray-800 font-semibold">Your Assigned Supervisor</h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Supervisor Info */}
                  <div>
                    <h4 className="font-semibold text-lg mb-4 text-gray-800">Supervisor Details</h4>
                    <div className="space-y-3">
                      <InfoItem
                        label="Name"
                        value={`${assignment?.accepted_faculty?.user_id?.first_name || ""} ${assignment?.accepted_faculty?.user_id?.last_name || ""}`.trim() || "N/A"}
                      />
                      <InfoItem label="Designation" value={assignment?.accepted_faculty?.designation || "N/A"} />
                      <InfoItem label="Department" value={assignment?.accepted_faculty?.user_id?.department || "N/A"} />
                      <InfoItem label="Specialization" value={assignment?.accepted_faculty?.specialization || "N/A"} />
                      <InfoItem label="Research Interests" value={assignment?.accepted_faculty?.research_interests || "N/A"} />
                      <InfoItem label="Email" value={assignment?.accepted_faculty?.user_id?.email || "N/A"} />
                      <InfoItem
                        label="Current Students"
                        value={`${assignment?.accepted_faculty?.current_supervision_count ?? 0}/${assignment?.accepted_faculty?.max_supervision_capacity ?? 0}`}
                      />
                    </div>
                  </div>

                  {/* Assignment Info */}
                  <div>
                    <h4 className="font-semibold text-lg mb-4 text-gray-800">Assignment Details</h4>
                    <div className="space-y-3">
                      <InfoItem
                        label="Request Date"
                        value={assignment?.createdAt ? new Date(assignment.createdAt).toLocaleDateString("en-GB") : "N/A"}
                      />
                      <InfoItem label="Status" value={assignment?.overall_status || "N/A"} />
                      <InfoItem label="Research Area" value={assignment?.research_area || "N/A"} />
                      <InfoItem label="Proposed Title" value={assignment?.proposed_title || "N/A"} />
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">Next Steps:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Contact your supervisor to discuss research direction</li>
                        <li>• Prepare your thesis proposal</li>
                        <li>• Schedule regular meetings</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-500">Your Original Priority List</h4>
              <div className="space-y-2">
                {Array.isArray(assignment?.priority_list) &&
                  assignment.priority_list.map((p, idx) => {
                    const faculty = p?.faculty_id || {};
                    const u = faculty?.user_id || {};
                    const isAssigned = assignment?.accepted_faculty?._id === faculty?._id;
                    const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "Unknown";

                    return (
                      <div
                        key={p?._id || idx}
                        className={`p-3 border rounded-lg ${
                          isAssigned ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">
                            <strong>Priority {idx + 1}:</strong> {name}
                            {isAssigned && (
                              <span className="ml-2 text-green-600 font-semibold">(Assigned)</span>
                            )}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              p?.status === "PGCAccepted"
                                ? "bg-green-100 text-green-800"
                                : p?.status === "SupervisorAccepted"
                                ? "bg-blue-100 text-blue-800"
                                : p?.status === "SupervisorRejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {(p?.status || "Unknown").replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Global message */}
        {message && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg">{message}</div>
        )}
      </div>
    </main>
  );
}

/* Helper component for info display */
function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 pb-2">
      <span className="font-medium text-gray-600 mb-1 sm:mb-0">{label}:</span>
      <span className="text-gray-900 break-words">{value}</span>
    </div>
  );
}
