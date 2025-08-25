"use client";

import { useState } from "react";
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

  const router = useRouter();

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
        "http://localhost:8080/api/admin/push-courses-from-csv",
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
      alert("Course assigned successfully");
    } catch (error) {
      setLoading(false);
      alert("Error assigning course. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-black mb-8">Manage Courses</h1>

        {/* Bulk Upload Form */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4">Bulk Upload Courses via CSV</h2>
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
          <h2 className="text-xl font-semibold mb-4">Manually Assign Course to Student</h2>
          <form onSubmit={handleAssignCourse} className="grid grid-cols-1 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Student ID</label>
              <input
                type="text"
                name="student_id"
                value={studentData.student_id}
                onChange={(e) => setStudentData({ ...studentData, student_id: e.target.value })}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Course ID</label>
              <input
                type="text"
                name="course_id"
                value={studentData.course_id}
                onChange={(e) => setStudentData({ ...studentData, course_id: e.target.value })}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="text-right mt-4">
              <button
                type="submit"
                className={`bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "Assigning..." : "Assign Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseManagementPage;
