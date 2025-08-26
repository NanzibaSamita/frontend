"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const CourseManagementPage = () => {
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState({
    student_id: "",
    course_id: "",
  });

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const router = useRouter();

  // Fetch students & courses for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [studentRes, courseRes] = await Promise.all([
          axios.get("http://localhost:8080/api/admin/students", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8080/api/admin/courses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStudents(studentRes.data);
        setCourses(courseRes.data);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  // Bulk upload course
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkUploading(true);
    setBulkResult(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in as admin to perform this action.");
        setBulkUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:8080/api/admin/upload-courses",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setBulkUploading(false);
      setBulkResult(response.data);
    } catch (error) {
      setBulkUploading(false);
      setBulkResult({
        message: "Bulk upload failed",
        errors: [
          {
            reason:
              error.response?.data?.message ||
              "Unknown error. Please check your file and try again.",
          },
        ],
      });
    }
  };

  // Handle manual course assignment to students
  const handleAssignCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in as admin to perform this action.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/api/admin/assign-course-manually",
        studentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      alert("✅ Course assigned successfully");
    } catch (error) {
      setLoading(false);
      alert(
        "❌ Error assigning course: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  // Handle auto course assignment
  const handleAutoAssign = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in as admin to perform this action.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/api/admin/assign-courses",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      alert(
        `✅ Auto assignment done. Created: ${response.data.created}, Skipped: ${response.data.skipped}`
      );
    } catch (error) {
      setLoading(false);
      alert(
        "❌ Auto assignment failed: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-black mb-8">Manage Courses</h1>

        {/* Bulk Upload Form */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Bulk Upload Courses via CSV
          </h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleBulkUpload}
            disabled={bulkUploading}
            className="mb-2"
          />
          {bulkUploading && <div className="text-blue-600">Uploading...</div>}
          {bulkResult && (
            <div className="mt-4 p-4 border rounded bg-gray-50">
              <div className="font-bold">{bulkResult.message}</div>
              <div>Total Records: {bulkResult.total || 0}</div>
              <div>Failed: {bulkResult.failed || 0}</div>
              {bulkResult.errors && bulkResult.errors.length > 0 && (
                <div className="mt-2">
                  <div className="font-semibold">Errors:</div>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {bulkResult.errors.map((err, idx) => (
                      <li key={idx}>
                        {err.course_code ? `Course ${err.course_code}: ` : ""}
                        {err.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Manual Course Assignment Form */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">
            Manually Assign Course to Student
          </h2>
          <form onSubmit={handleAssignCourse} className="grid grid-cols-1 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Student
              </label>
              <select
                value={studentData.student_id}
                onChange={(e) =>
                  setStudentData({ ...studentData, student_id: e.target.value })
                }
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              >
                <option value="">-- Select Student --</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.user_id?.name} ({s.user_id?.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Course</label>
              <select
                value={studentData.course_id}
                onChange={(e) =>
                  setStudentData({ ...studentData, course_id: e.target.value })
                }
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              >
                <option value="">-- Select Course --</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.course_code} - {c.course_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-right mt-4">
              <button
                type="submit"
                className={`bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Assigning..." : "Assign Course"}
              </button>
            </div>
          </form>
        </div>

        {/* Auto Assignment */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl font-semibold mb-4">Auto Assign Courses</h2>
          <button
            onClick={handleAutoAssign}
            className={`bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Assigning..." : "Auto Assign Courses"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseManagementPage;
