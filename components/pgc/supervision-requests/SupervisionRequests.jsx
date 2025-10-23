"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import axios from "axios";

/* -------------------- API endpoints -------------------- */
const API_ENDPOINTS = {
  PENDING: "http://localhost:8080/api/pgc/supervision-requests",
  ASSIGNED: "http://localhost:8080/api/pgc/assigned-supervisors",
  MANUAL: "http://localhost:8080/api/pgc/manual-assignments-with-supervisors",
  RESPOND: "http://localhost:8080/api/pgc/pgc-respond",
  ASSIGN_SUPERVISOR: "http://localhost:8080/api/pgc/assign-supervisor",
};

export default function SupervisionRequests() {
  const [assignments, setAssignments] = useState({
    pending: [],
    assigned: [],
    manual: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); 
  const [openAssignment, setOpenAssignment] = useState({
    assignment: null,
    type: null,
  });

  const api = useMemo(() => {
    const instance = axios.create({ withCredentials: true });
    instance.interceptors.request.use((cfg) => {
      const token =
        typeof window !== "undefined"
          ? sessionStorage.getItem("token") || localStorage.getItem("token")
          : null;
      if (token) cfg.headers.Authorization = `Bearer ${token}`;
      return cfg;
    });
    return instance;
  }, []);

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-GB") : "—";

  /* -------------------- Load All Data -------------------- */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const [pendingRes, assignedRes, manualRes] = await Promise.all([
        api.get(API_ENDPOINTS.PENDING).catch(() => ({ data: { assignments: [] } })),
        api.get(API_ENDPOINTS.ASSIGNED).catch(() => ({ data: { assignments: [] } })),
        api.get(API_ENDPOINTS.MANUAL).catch(() => ({ data: { assignments: [] } })),
      ]);

      setAssignments({
        pending: pendingRes.data.assignments || [],
        assigned: assignedRes.data.assignments || [],
        manual: manualRes.data.assignments || [],
      });
    } catch (e) {
      setError(`Failed to load data: ${e.message}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* -------------------- Manual Supervisor Assignment -------------------- */
  const handleManualAssign = async (studentId, supervisorId) => {
    try {
      await api.post(API_ENDPOINTS.ASSIGN_SUPERVISOR, { studentId, supervisorId });
      setMessage("Supervisor assigned successfully!");
      setOpenAssignment({ assignment: null, type: null });
      await loadData();

      // Automatically clear message after 5 seconds
      setTimeout(() => setMessage(""), 5000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to assign supervisor");
      setTimeout(() => setError(""), 5000);
    }
  };

  const getFacultyName = (faculty) => {
    if (!faculty?.user_id) return "—";
    return `${faculty.user_id.first_name || ""} ${faculty.user_id.last_name || ""}`.trim() || "—";
  };

  if (loading) return <div className="p-10">Loading…</div>;

  return (
    <div className="w-full p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-semibold mb-6">Supervisor Approval</h1>

      {/* Inline success/error message display */}
      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">
          {error}
        </div>
      )}

      {/* Pending Supervisor Approval */}
      <Card title="Pending Supervisor Approval" className="mb-6 md:mb-8">
        <AssignmentTable
          headers={["Student", "ID", "Program", "Supervisor Interested", "Submitted on", ""]}
          assignments={assignments.pending}
          getFaculty={(a) => a.priority_list?.[a.current_priority_index || 0]?.faculty_id}
          openAssignment={openAssignment}
          onToggle={(assignment) =>
            setOpenAssignment({
              assignment: openAssignment.assignment?._id === assignment._id ? null : assignment,
              type: "pending",
            })
          }
          formatDate={formatDate}
          getFacultyName={getFacultyName}
        />
      </Card>

      {/* Manual Assignment (PGC Review) */}
      <Card title="Manual Assignment (PGC Review)" className="mb-6 md:mb-8">
        <AssignmentTable
          headers={["Student", "ID", "Program", "Eligible Faculty", "Submitted on", ""]}
          assignments={assignments.manual}
          getFaculty={() => null}
          openAssignment={openAssignment}
          onToggle={(assignment) =>
            setOpenAssignment({
              assignment: openAssignment.assignment?._id === assignment._id ? null : assignment,
              type: "manual",
            })
          }
          formatDate={formatDate}
          getFacultyName={() => "Click to view"}
        />

        {openAssignment.type === "manual" && openAssignment.assignment && (
          <DetailDropDown
            assignment={openAssignment.assignment}
            onAssign={(facultyId) =>
              handleManualAssign(openAssignment.assignment.student_id._id, facultyId)
            }
          />
        )}
      </Card>

      {/* Assigned Supervisors */}
      <Card title="Assigned Supervisors">
        <AssignmentTable
          headers={["Student", "ID", "Program", "Supervisor", "Submitted on", ""]}
          assignments={assignments.assigned}
          getFaculty={(a) => a.accepted_faculty}
          openAssignment={openAssignment}
          onToggle={(assignment) =>
            setOpenAssignment({
              assignment: openAssignment.assignment?._id === assignment._id ? null : assignment,
              type: "assigned",
            })
          }
          formatDate={formatDate}
          getFacultyName={getFacultyName}
        />
      </Card>
    </div>
  );
}

/* -------------------- Components -------------------- */
function AssignmentTable({ headers, assignments, getFaculty, openAssignment, onToggle, formatDate, getFacultyName }) {
  return (
    <Table headers={headers}>
      {assignments.map((assignment) => {
        const student = assignment.student_id || {};
        const user = student.user_id || {};
        const program = student.program_id || {};
        const faculty = getFaculty(assignment);

        return (
          <tr key={assignment._id} className="border-t hover:bg-gray-50 transition duration-150 ease-in-out">
            <Td>{`${user.first_name || ""} ${user.last_name || ""}`.trim() || "—"}</Td>
            <Td>{student.student_number || "—"}</Td>
            <Td>{program.program_name || "—"}</Td>
            <Td>{getFacultyName(faculty || assignment)}</Td>
            <Td>{formatDate(assignment.createdAt)}</Td>
            <Td className="text-right">
              <button
                onClick={() => onToggle(assignment)}
                className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-150 ease-in-out"
              >
                {openAssignment.assignment?._id === assignment._id ? "Hide" : "View"}
              </button>
            </Td>
          </tr>
        );
      })}
    </Table>
  );
}

function DetailDropDown({ assignment, onAssign }) {
  const student = assignment.student_id || {};
  const user = student.user_id || {};
  const program = student.program_id || {};
  const studentName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "—";

  const studentInfo = {
    Name: studentName,
    ID: student.student_number || "—",
    Program: program.program_name || "—",
    CGPA: student.cgpa || "—",
    Credits: `${student.obtained_credits || 0}/${student.total_credit_hours || 0}`,
    Department: user.department || "—",
    Contact: user.email || "—",
  };

  return (
    <div className="mt-6 border rounded-lg bg-white shadow-sm">
      <div className="p-4">
        <InfoCard title="Student Information" className="mb-4">
          {Object.entries(studentInfo).map(([k, v]) => (
            <InfoRow key={k} label={k} value={v} />
          ))}
        </InfoCard>
      </div>

      <div className="p-4 pt-0">
        <h3 className="text-lg font-semibold mb-3">Available Supervisors</h3>
        <div className="max-h-96 overflow-y-auto space-y-4">
          {assignment.available_supervisors?.length ? (
            assignment.available_supervisors.map((faculty) => (
              <InfoCard
                key={faculty._id}
                title={`${faculty.user_id?.first_name || ""} ${faculty.user_id?.last_name || ""}`}
                className="mb-0"
              >
                <InfoRow label="ID" value={faculty.employee_id || "—"} />
                <InfoRow label="Department" value={faculty.user_id?.department || "—"} />
                <InfoRow label="Domain" value={faculty.research_interests || "—"} />
                <InfoRow
                  label="Supervision Load"
                  value={`${faculty.current_supervision_count || 0}/${faculty.max_supervision_capacity || 0}`}
                />
                <InfoRow label="Contact" value={faculty.user_id?.email || "—"} />

                {/* ✅ Fixed: valid table structure */}
                <tr>
                  <td colSpan="2" className="pt-3">
                    <button
                      onClick={() => onAssign(faculty._id)}
                      className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition duration-150 ease-in-out"
                    >
                      Assign this Supervisor
                    </button>
                  </td>
                </tr>
              </InfoCard>
            ))
          ) : (
            <p className="text-gray-600">No eligible supervisors available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- UI Helpers -------------------- */
function Card({ title, className = "", children }) {
  return (
    <div className={`bg-white rounded-lg shadow-md border ${className}`}>
      <div className="px-5 py-4 border-b font-semibold">{title}</div>
      <div>{children}</div>
    </div>
  );
}

function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-700">
            {headers.map((h, i) => (
              <th key={i} className="text-left font-medium px-3 sm:px-5 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">{children}</tbody>
      </table>
    </div>
  );
}

function Td({ className = "", children }) {
  return <td className={`px-3 sm:px-5 py-3 align-top ${className}`}>{children}</td>;
}

function InfoCard({ title, className = "", children }) {
  return (
    <div className={`rounded-lg border bg-white ${className}`}>
      <div className="bg-gray-50 px-3 py-2 text-sm font-medium">{title}</div>
      <table className="w-full text-sm">
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <tr className="border-t">
      <td className="w-32 sm:w-40 md:w-48 text-gray-600 px-3 py-2">{label}</td>
      <td className="px-3 py-2">{value || "—"}</td>
    </tr>
  );
}