"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import axios from "axios";

/* -------------------- API endpoints -------------------- */
const PGC_PENDING_URL = "http://localhost:8080/api/pgc/supervision-requests";
const PGC_RESPOND_URL = "http://localhost:8080/api/pgc/pgc-respond";
const PGC_ASSIGNED_URL = "http://localhost:8080/api/pgc/assigned-supervisors";

export default function SupervisionRequests() {
  const [pending, setPending] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openPendingFor, setOpenPendingFor] = useState(null);
  const [openAssignedFor, setOpenAssignedFor] = useState(null);

  const api = useMemo(() => {
    const instance = axios.create({ withCredentials: true });
    instance.interceptors.request.use((cfg) => {
      if (typeof window !== "undefined") {
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        if (token) cfg.headers.Authorization = `Bearer ${token}`;
      }
      return cfg;
    });
    return instance;
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (
        typeof window !== "undefined" &&
        !sessionStorage.getItem("token") &&
        !localStorage.getItem("token")
      ) {
        setError("Not authenticated. Please log in first.");
        setLoading(false);
        return;
      }

      const [pendingRes, assignedRes] = await Promise.all([
        api.get(PGC_PENDING_URL),
        api.get(PGC_ASSIGNED_URL),
      ]);

      setPending(pendingRes?.data?.assignments ?? []);
      setAssigned(assignedRes?.data?.assignments ?? []);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      setError(`Failed to load: ${msg}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const pgcRespond = async (assignmentId, response) => {
    try {
      setError("");
      await api.post(PGC_RESPOND_URL, { assignmentId, response });
      await loadData();
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      setError(`Action failed: ${msg}`);
      console.error(e);
    }
  };

  const handleApprove = (assignment) => pgcRespond(assignment._id, "Accepted");
  const handleReject = (assignment) => pgcRespond(assignment._id, "Rejected");
  const handleComment = (assignment) => {
    const studentName = assignment.student_id?.user_id?.first_name || "student";
    alert(`Comment functionality for ${studentName}`);
  };

  const getCurrentFaculty = (assignment) => {
    if (!assignment.priority_list || !assignment.priority_list.length) return {};
    const currentIndex = assignment.current_priority_index || 0;
    const faculty = assignment.priority_list[currentIndex]?.faculty_id || {};
    const user = faculty?.user_id || {};
    return { ...faculty, user_id: user };
  };

  const getFacultyName = (faculty) => {
    if (!faculty) return "—";
    const user = faculty.user_id || {};
    return `${user.first_name || ""} ${user.last_name || ""}`.trim() || "—";
  };

  if (loading) return <div className="p-10">Loading…</div>;
  if (error) return <div className="p-10 text-red-600">{error}</div>;

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-semibold mb-6">Supervisor Approval</h1>

      {/* Pending Supervisor Approval */}
      <Card title="Pending Supervisor Approval" className="mb-8">
        <Table headers={["Student", "ID", "Program", "Supervisor Interested", "Submitted on", ""]}>
          {pending.map((assignment) => {
            const student = assignment.student_id || {};
            const user = student.user_id || {};
            const faculty = getCurrentFaculty(assignment);

            return (
              <tr key={assignment._id} className="border-t">
                <Td>{`${user.first_name || ""} ${user.last_name || ""}`.trim() || "—"}</Td>
                <Td>{student.student_number || "—"}</Td>
                <Td>{student.program_id || "—"}</Td>
                <Td>{getFacultyName(faculty)}</Td>
                <Td>{formatDate(assignment.createdAt)}</Td>
                <Td className="text-right">
                  <button
                    onClick={() =>
                      setOpenPendingFor((cur) =>
                        cur?._id === assignment._id ? null : assignment
                      )
                    }
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    {openPendingFor?._id === assignment._id ? "Hide" : "View"}
                  </button>
                </Td>
              </tr>
            );
          })}
        </Table>

        {openPendingFor && (
          <DetailDropDown
            assignment={openPendingFor}
            showActions={true}
            onComment={() => handleComment(openPendingFor)}
            onApprove={() => handleApprove(openPendingFor)}
            onReject={() => handleReject(openPendingFor)}
          />
        )}
      </Card>

      {/* Assigned Supervisors */}
      <Card title="Assigned Supervisors">
        <Table headers={["Student", "ID", "Program", "Supervisor", "Submitted on", ""]}>
          {assigned.map((assignment) => {
            const student = assignment.student_id || {};
            const user = student.user_id || {};
            const faculty = assignment.accepted_faculty || {};
            const facultyUser = faculty.user_id || {};

            return (
              <tr key={assignment._id} className="border-t">
                <Td>{`${user.first_name || ""} ${user.last_name || ""}`.trim() || "—"}</Td>
                <Td>{student.student_number || "—"}</Td>
                <Td>{student.program_id || "—"}</Td>
                <Td>{`${facultyUser.first_name || ""} ${facultyUser.last_name || ""}`.trim() || "—"}</Td>
                <Td>{formatDate(assignment.createdAt)}</Td>
                <Td className="text-right">
                  <button
                    onClick={() =>
                      setOpenAssignedFor((cur) =>
                        cur?._id === assignment._id ? null : assignment
                      )
                    }
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    {openAssignedFor?._id === assignment._id ? "Hide" : "View"}
                  </button>
                </Td>
              </tr>
            );
          })}
        </Table>

        {openAssignedFor && (
          <DetailDropDown assignment={openAssignedFor} showActions={false} />
        )}
      </Card>
    </div>
  );
}

/* -------------------- Drop-down details -------------------- */
function DetailDropDown({ assignment, showActions = true, onComment, onApprove, onReject }) {
  const student = assignment.student_id || {};
  const user = student.user_id || {};

  // pick faculty depending on assignment status
  let faculty = {};
  if (assignment.overall_status === "Assigned") {
    faculty = assignment.accepted_faculty || {};
  } else {
    faculty = assignment.priority_list?.[assignment.current_priority_index || 0]?.faculty_id || {};
  }
  const facultyUser = faculty.user_id || {};

  const studentName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "—";
  const facultyName = `${facultyUser.first_name || ""} ${facultyUser.last_name || ""}`.trim() || "—";

  const studentInfo = {
    Name: studentName,
    ID: student.student_number || "—",
    Program: student.program_id || "—",
    "Admission Year": student.admission_year || "—",
    "Current Semester": student.current_semester || "—",
    CGPA: student.cgpa || "—",
    "Credits (Completed/Total)": `${student.obtained_credits || 0}/${student.total_credit_hours || 0}`,
    "Research Area": student.research_area || "—",
    Status: student.status || "—",
    Contact: user.email || "—",
  };

  const supervisorInfo = {
    Name: facultyName,
    ID: faculty.employee_id || "—",
    Department: facultyUser.department || "—",
    Domain: faculty.research_interests || "—",
    "Students Supervised": `${faculty.current_supervision_count || 0}/${faculty.max_supervision_capacity || 0}`,
    Contact: facultyUser.email || "—",
  };

  const summary = {
    student: studentName,
    id: student.student_number || "—",
    program: student.program_id || "—",
    sup: facultyName,
    date: new Date(assignment.createdAt).toLocaleDateString("en-GB") || "—",
  };

  return (
    <div className="mt-6 border rounded bg-white">
      {/* Summary Table */}
      <div className="rounded border m-4 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <Th>Student</Th>
              <Th>ID</Th>
              <Th>Program</Th>
              <Th>Supervisor</Th>
              <Th>Submitted on</Th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <Td>{summary.student}</Td>
              <Td>{summary.id}</Td>
              <Td>{summary.program}</Td>
              <Td>{summary.sup}</Td>
              <Td>{summary.date}</Td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Two-column info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <InfoCard title="Student Information">
          {Object.entries(studentInfo).map(([k, v]) => (
            <InfoRow key={k} label={k} value={v} />
          ))}
        </InfoCard>

        <InfoCard title="Supervisor Information">
          {Object.entries(supervisorInfo).map(([k, v]) => (
            <InfoRow key={k} label={k} value={v} />
          ))}
        </InfoCard>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-3 px-4 pb-4">
          <button
            onClick={onComment}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Comment
          </button>
          <button
            onClick={onApprove}
            className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------- UI Helpers -------------------- */
function Card({ title, className = "", children }) {
  return (
    <div className={`bg-white rounded shadow-sm border ${className}`}>
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
              <th key={i} className="text-left font-medium px-5 py-3">
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

function Th({ children }) {
  return <th className="text-left px-3 py-2">{children}</th>;
}
function Td({ className = "", children }) {
  return <td className={`px-5 py-3 align-top ${className}`}>{children}</td>;
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded border">
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
      <td className="w-40 sm:w-48 text-gray-600 px-3 py-2">{label}</td>
      <td className="px-3 py-2">{value || "—"}</td>
    </tr>
  );
}
