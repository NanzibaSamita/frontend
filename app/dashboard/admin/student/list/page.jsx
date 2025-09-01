"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin-sidebar"; // Optional: keep if you use a sidebar

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students || data); // Adjust if your API response is different
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        alert("Failed to fetch students");
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Loading students...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <AdminSidebar /> */}

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8">All Students</h1>

        <div className="bg-white shadow-md rounded-md w-full max-w-6xl overflow-x-auto">
          <table className="min-w-full text-sm text-left ">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Full Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Student Number</th>
                <th className="px-4 py-3 font-semibold">Program</th>
                <th className="px-4 py-3 font-semibold">Academic Year</th>
                <th className="px-4 py-3 font-semibold">Semester</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center px-4 py-6">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((s, i) => {
                  const d = s.student_details || {};
                  return (
                    <tr
                      key={s._id || i}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3">{i + 1}</td>
                      <td className="px-4 py-3">
                        {s.first_name} {s.last_name}
                      </td>
                      <td className="px-4 py-3">{s.email}</td>
                      <td className="px-4 py-3">{s.department}</td>
                      <td className="px-4 py-3">{d.student_number || "-"}</td>
                      <td className="px-4 py-3">{d.program_id || "-"}</td>
                      <td className="px-4 py-3">{d.admission_year || "-"}</td>
                      <td className="px-4 py-3">{d.current_semester || "-"}</td>
                      <td className="px-4 py-3">{d.status || "-"}</td>
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
