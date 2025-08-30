"use client";

import { useState, useEffect } from "react";

export default function SupervisorPage() {
  const [supervisors, setSupervisors] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [pageState, setPageState] = useState("loading"); // loading, not_assigned, pending, assigned

  // Fetch all data and determine page state
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(true);
        const token = localStorage.getItem("token");

        // Check if assignment exists first
        const assignRes = await fetch(
          "http://localhost:8080/api/students/assignment/check-status",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (assignRes.ok) {
          const assignData = await assignRes.json();
          setAssignment(assignData.assignment);
          
          // Determine state based on assignment status
          if (assignData.assignment.overall_status === "Assigned") {
            setPageState("assigned");
          } else {
            setPageState("pending");
          }
        } else {
          // No assignment exists, check eligibility and load supervisors
          const eligRes = await fetch(
            "http://localhost:8080/api/students/supervisor-assignment/check-eligibility",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const eligData = await eligRes.json();
          setEligible(eligData.isEligible || false);

          // Fetch available supervisors
          const supRes = await fetch(
            "http://localhost:8080/api/students/supervisor-assignment/available",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const supData = await supRes.json();
          setSupervisors(supData.availableSupervisors || []);
          
          setPageState("not_assigned");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setMessage("Failed to load data.");
        setPageState("not_assigned");
      } finally {
        setPageLoading(false);
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

  // Submit request
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
        setMessage("Supervisor Assignment Request Created!");
        // Refresh the page to show pending state
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      setMessage("Error creating assignment request.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
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
                  {supervisors.map((sup) => (
                    <option key={sup._id} value={sup._id}>
                      {sup.user_id.first_name} {sup.user_id.last_name} - {sup.designation}
                      ({sup.current_supervision_count}/{sup.max_supervision_capacity})
                    </option>
                  ))}
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
                    const sup = supervisors.find((s) => s._id === id);
                    return (
                      <div
                        key={id}
                        className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md flex justify-between items-center"
                      >
                        <span>
                          <strong>Priority {idx + 1}:</strong>{" "}
                          {sup
                            ? `${sup.user_id.first_name} ${sup.user_id.last_name} - ${sup.designation}`
                            : "Unknown"}
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
              <strong>Status:</strong> {assignment.overall_status} - Waiting for supervisor and PGC approval
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Your Priority List</h3>
              <div className="space-y-3">
                {assignment.priority_list?.map((p, idx) => {
                  const faculty = p.faculty_id;
                  const isCurrentPriority = idx === assignment.current_priority_index;
                  
                  return (
                    <div
                      key={p._id}
                      className={`p-4 border rounded-lg ${
                        isCurrentPriority ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">
                            Priority {idx + 1}: {faculty?.user_id?.first_name} {faculty?.user_id?.last_name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {faculty?.designation} | {faculty?.specialization}
                          </p>
                          <p className="text-sm text-gray-600">
                            Department: {faculty?.user_id?.department}
                          </p>
                          {faculty?.research_interests && (
                            <p className="text-sm text-gray-600 mt-1">
                              Research: {faculty.research_interests}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                            p.status === 'SupervisorAccepted' ? 'bg-green-100 text-green-800' :
                            p.status === 'Requested' ? 'bg-yellow-100 text-yellow-800' :
                            p.status === 'SupervisorRejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {p.status.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          {isCurrentPriority && (
                            <div className="text-xs text-blue-600 mt-1 font-semibold">
                              Current Priority
                            </div>
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
                <h3 className="text-xl font-semibold">Your Assigned Supervisor</h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Supervisor Info */}
                  <div>
                    <h4 className="font-semibold text-lg mb-4 text-gray-800">Supervisor Details</h4>
                    <div className="space-y-3">
                      <InfoItem 
                        label="Name" 
                        value={`${assignment.accepted_faculty?.user_id?.first_name || ''} ${assignment.accepted_faculty?.user_id?.last_name || ''}`} 
                      />
                      <InfoItem 
                        label="Designation" 
                        value={assignment.accepted_faculty?.designation || 'N/A'} 
                      />
                      <InfoItem 
                        label="Department" 
                        value={assignment.accepted_faculty?.user_id?.department || 'N/A'} 
                      />
                      <InfoItem 
                        label="Specialization" 
                        value={assignment.accepted_faculty?.specialization || 'N/A'} 
                      />
                      <InfoItem 
                        label="Research Interests" 
                        value={assignment.accepted_faculty?.research_interests || 'N/A'} 
                      />
                      <InfoItem 
                        label="Email" 
                        value={assignment.accepted_faculty?.user_id?.email || 'N/A'} 
                      />
                      <InfoItem 
                        label="Current Students" 
                        value={`${assignment.accepted_faculty?.current_supervision_count || 0}/${assignment.accepted_faculty?.max_supervision_capacity || 0}`} 
                      />
                    </div>
                  </div>

                  {/* Assignment Info */}
                  <div>
                    <h4 className="font-semibold text-lg mb-4 text-gray-800">Assignment Details</h4>
                    <div className="space-y-3">
                      <InfoItem 
                        label="Request Date" 
                        value={new Date(assignment.createdAt).toLocaleDateString('en-GB')} 
                      />
                      <InfoItem 
                        label="Status" 
                        value={assignment.overall_status} 
                      />
                      <InfoItem 
                        label="Research Area" 
                        value={assignment.research_area || 'N/A'} 
                      />
                      <InfoItem 
                        label="Proposed Title" 
                        value={assignment.proposed_title || 'N/A'} 
                      />
                    </div>

                    {/* Next steps */}
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

            {/* Show original priority list */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Your Original Priority List</h4>
              <div className="space-y-2">
                {assignment.priority_list?.map((p, idx) => {
                  const faculty = p.faculty_id;
                  const isAssigned = assignment.accepted_faculty?._id === faculty?._id;
                  
                  return (
                    <div
                      key={p._id}
                      className={`p-3 border rounded-lg ${
                        isAssigned ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          <strong>Priority {idx + 1}:</strong> {faculty?.user_id?.first_name} {faculty?.user_id?.last_name}
                          {isAssigned && <span className="ml-2 text-green-600 font-semibold">(Assigned)</span>}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          p.status === 'PGCAccepted' ? 'bg-green-100 text-green-800' :
                          p.status === 'SupervisorAccepted' ? 'bg-blue-100 text-blue-800' :
                          p.status === 'SupervisorRejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {p.status.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* State 2: Assignment pending - show priority list with status */}
        {pageState === "pending" && assignment && (
          <div>
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg">
              <strong>Status:</strong> {assignment.overall_status} - Your request is being processed
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Your Priority List</h3>
              <div className="space-y-3">
                {assignment.priority_list?.map((p, idx) => {
                  const faculty = p.faculty_id;
                  const isCurrentPriority = idx === assignment.current_priority_index;
                  
                  return (
                    <div
                      key={p._id}
                      className={`p-4 border rounded-lg ${
                        isCurrentPriority ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            Priority {idx + 1}: {faculty?.user_id?.first_name} {faculty?.user_id?.last_name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {faculty?.designation} | {faculty?.specialization}
                          </p>
                          <p className="text-sm text-gray-600">
                            Department: {faculty?.user_id?.department}
                          </p>
                          <p className="text-sm text-gray-600">
                            Email: {faculty?.user_id?.email}
                          </p>
                          {faculty?.research_interests && (
                            <p className="text-sm text-gray-600 mt-1">
                              Research: {faculty.research_interests}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            Current Students: {faculty?.current_supervision_count || 0}/{faculty?.max_supervision_capacity || 0}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                            p.status === 'SupervisorAccepted' ? 'bg-green-100 text-green-800' :
                            p.status === 'Requested' ? 'bg-yellow-100 text-yellow-800' :
                            p.status === 'SupervisorRejected' ? 'bg-red-100 text-red-800' :
                            p.status === 'PGCAccepted' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {p.status.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          {isCurrentPriority && (
                            <div className="text-xs text-blue-600 mt-1 font-semibold">
                              Current Priority
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-2">Process Status:</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• Your request has been submitted and is being processed</p>
                <p>• The system is currently working on Priority {(assignment.current_priority_index || 0) + 1}</p>
                <p>• You will receive notifications about status updates</p>
                <p>• If one supervisor declines, the system automatically moves to your next choice</p>
              </div>
            </div>
          </div>
        )}

        {/* Global message */}
        {message && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg">
            {message}
          </div>
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