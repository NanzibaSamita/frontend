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

  const [studentQuery, setStudentQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [courseQuery, setCourseQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const router = useRouter();

  // --- Debounced Student Search ---
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!studentQuery) return setFilteredStudents([]);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8080/api/admin/search/students?query=${studentQuery}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFilteredStudents(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [studentQuery]);

  // --- Debounced Course Search ---
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!courseQuery) return setFilteredCourses([]);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8080/api/admin/search/courses?query=${courseQuery}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFilteredCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [courseQuery]);

  // --- Bulk Upload ---
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkUploading(true);
    setBulkResult(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Admin not logged in");

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
    } catch (err) {
      setBulkUploading(false);
      setBulkResult({
        message: "Bulk upload failed",
        errors: [{ reason: err.response?.data?.message || err.message }],
      });
    }
  };

  // --- Manual Assignment ---
  const handleAssignCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Admin not logged in");

      await axios.post(
        "http://localhost:8080/api/admin/assign-courses-manually",
        studentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Course assigned successfully");

      // Clear inputs after assignment
      setStudentQuery("");
      setCourseQuery("");
      setFilteredStudents([]);
      setFilteredCourses([]);
      setStudentData({ student_id: "", course_id: "" });
    } catch (err) {
      alert(
        "❌ Error assigning course: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Auto Assignment ---
  const handleAutoAssign = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Admin not logged in");

      const response = await axios.post(
        "http://localhost:8080/api/admin/assign-courses",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(
        `✅ Auto assignment done. Created: ${response.data.created}, Skipped: ${response.data.skipped}`
      );
    } catch (err) {
      alert(
        "❌ Auto assignment failed: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-black mb-8">Manage Courses</h1>

        {/* --- Bulk Upload Section --- */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Bulk Upload Courses via CSV
          </h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleBulkUpload}
            disabled={bulkUploading}
          />
          {bulkUploading && (
            <div className="text-blue-600 mt-2">Uploading...</div>
          )}
          {bulkResult && (
            <div className="mt-4 p-4 border rounded bg-gray-50">
              <div className="font-bold">{bulkResult.message}</div>
              {bulkResult.total !== undefined && (
                <div>Total Records: {bulkResult.total}</div>
              )}
              {bulkResult.failed !== undefined && (
                <div>Failed: {bulkResult.failed}</div>
              )}
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

        {/* --- Manual Assignment Section --- */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Manually Assign Course to Student
          </h2>
          <form
            onSubmit={handleAssignCourse}
            className="grid grid-cols-1 gap-6"
          >
            {/* Student Autocomplete */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-700">
                Student
              </label>
              <input
                type="text"
                value={studentQuery}
                onChange={(e) => setStudentQuery(e.target.value)}
                placeholder="Type student number"
                className="mt-2 p-3 border border-gray-300 rounded-md"
                autoComplete="off"
              />
              {filteredStudents.length > 0 && (
                <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-auto shadow-lg">
                  {filteredStudents.map((s) => (
                    <li
                      key={s._id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setStudentData({ ...studentData, student_id: s._id });
                        setStudentQuery(`${s.student_number}`);
                        setFilteredStudents([]);
                      }}
                    >
                      {s.student_number}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Course Autocomplete */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-700">
                Course
              </label>
              <input
                type="text"
                value={courseQuery}
                onChange={(e) => setCourseQuery(e.target.value)}
                placeholder="Type course code or name"
                className="mt-2 p-3 border border-gray-300 rounded-md"
                autoComplete="off"
              />
              {filteredCourses.length > 0 && (
                <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-auto shadow-lg">
                  {filteredCourses.map((c) => (
                    <li
                      key={c._id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setStudentData({ ...studentData, course_id: c._id });
                        setCourseQuery(`${c.course_code} - ${c.course_name}`);
                        setFilteredCourses([]);
                      }}
                    >
                      {c.course_code} - {c.course_name}
                    </li>
                  ))}
                </ul>
              )}
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

        {/* --- Auto Assignment Section --- */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
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
