"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [students, setStudents] = useState([]); // For calculating dept counts
  const [previewAssignments, setPreviewAssignments] = useState([]); // From bulkResult.previewAssignments
  const [editedAssignments, setEditedAssignments] = useState({}); // { course_id: [student_ids] }
  const [confirming, setConfirming] = useState(false);
  const [confirmResult, setConfirmResult] = useState(null);

  // --- Fetch all students on load for department mapping ---
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/admin/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data.students || []);
      } catch (err) {
        console.error("Error fetching students:", err);
        setStudents([]);
      }
    };
    fetchStudents();
  }, []);

  // --- Fetch courses ---
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/admin/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // --- Bulk Upload ---
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkUploading(true);
    setBulkResult(null);
    setPreviewAssignments([]);
    setEditedAssignments({});
    setConfirmResult(null);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
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
      setBulkResult(res.data);

      // Handle preview assignments
      if (res.data.previewAssignments) {
        setPreviewAssignments(res.data.previewAssignments);
        const initialEdits = {};
        res.data.previewAssignments.forEach((pa) => {
          initialEdits[pa.course_id] = pa.proposed_students.map((s) => s.student_id);
        });
        setEditedAssignments(initialEdits);
      }

      // Fetch updated courses
      await fetchCourses();
    } catch (err) {
      console.error("Bulk upload error:", err);
      setBulkUploading(false);
      setBulkResult({
        message: "Bulk upload failed",
        errors: [{ reason: err.response?.data?.message || err.message }],
      });
    }
  };

  // --- Function to calculate student count per dept for a course ---
  const getDeptCountForCourse = (course_code) => {
    if (!course_code || course_code.length < 3) return {};
    const courseDept = course_code.slice(0, 3); // e.g., 'CSE'
    const count = {};
    students.forEach((s) => {
      if (s.department === courseDept) {
        count[s.department] = (count[s.department] || 0) + 1;
      }
    });
    return count;
  };

  // --- Generate Preview for Existing Courses ---
  const generatePreviewForCourses = async (selectedCourseIds) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8080/api/admin/generate-preview",
        { course_ids: selectedCourseIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.previewAssignments) {
        setPreviewAssignments(res.data.previewAssignments);
        const initialEdits = {};
        res.data.previewAssignments.forEach((pa) => {
          initialEdits[pa.course_id] = pa.proposed_students.map((s) => s.student_id);
        });
        setEditedAssignments(initialEdits);
      }
    } catch (err) {
      console.error("Preview generation error:", err);
      setConfirmResult({
        message: "Failed to generate preview",
        errors: [{ reason: err.response?.data?.message || err.message }],
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-black mb-8">Manage Courses</h1>

        {/* --- Bulk Upload Section --- */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-5xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4">Bulk Upload Courses via CSV</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleBulkUpload}
            disabled={bulkUploading}
            className="mb-2"
          />
          {bulkUploading && <div className="text-blue-600 mt-2">Uploading...</div>}
          {bulkResult && (
            <div className="mt-4 p-4 border rounded bg-gray-50">
              <div className="font-bold">{bulkResult.message}</div>
              {bulkResult.total !== undefined && <div>Total Records: {bulkResult.total}</div>}
              {bulkResult.successUploads !== undefined && (
                <div>Successful Uploads: {bulkResult.successUploads}</div>
              )}
              {bulkResult.failedUploads !== undefined && (
                <div>Failed Uploads: {bulkResult.failedUploads}</div>
              )}
              {bulkResult.uploadErrors && bulkResult.uploadErrors.length > 0 && (
                <div className="mt-2">
                  <div className="font-semibold">Upload Errors:</div>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {bulkResult.uploadErrors.map((err, idx) => (
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

        {/* --- Assignment Preview Section --- */}
        {previewAssignments.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 max-w-5xl mx-auto mb-8">
            <h2 className="text-xl font-semibold mb-4">Assignment Preview</h2>
            <p className="mb-4">Review and edit proposed student assignments for uploaded courses.</p>

            {previewAssignments.map((pa) => (
              <div key={pa.course_id} className="mb-6">
                <h3 className="text-lg font-medium mb-2">Course: {pa.course_code}</h3>
                <div className="mb-2 text-sm text-gray-600">
                  <span>Extracted Semester: {pa.extracted_semester || "N/A"}</span> | 
                  <span className="ml-2">Department: {pa.department}</span> | 
                  <span className={`ml-2 ${pa.is_theory ? 'text-green-600' : 'text-blue-600'}`}>
                    Type: {pa.is_theory ? 'Theory' : 'Lab'}
                  </span>
                </div>
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-3 border">Select</th>
                      <th className="py-2 px-3 border">Student Number</th>
                      <th className="py-2 px-3 border">Name</th>
                      <th className="py-2 px-3 border">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pa.proposed_students && pa.proposed_students.length > 0 ? (
                      pa.proposed_students.map((student) => (
                        <tr key={student.student_id} className="hover:bg-gray-50">
                          <td className="py-2 px-3 border">
                            <input
                              type="checkbox"
                              checked={editedAssignments[pa.course_id]?.includes(student.student_id)}
                              onChange={(e) => {
                                const updated = [...(editedAssignments[pa.course_id] || [])];
                                if (e.target.checked) {
                                  updated.push(student.student_id);
                                } else {
                                  const idx = updated.indexOf(student.student_id);
                                  if (idx > -1) updated.splice(idx, 1);
                                }
                                setEditedAssignments({ ...editedAssignments, [pa.course_id]: updated });
                              }}
                            />
                          </td>
                          <td className="py-2 px-3 border">{student.student_number}</td>
                          <td className="py-2 px-3 border">{student.name}</td>
                          <td className="py-2 px-3 border">{student.email || "N/A"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-gray-500 py-4">
                          No students proposed for this course.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setPreviewAssignments([]);
                  setEditedAssignments({});
                  setConfirmResult(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                disabled={confirming}
              >
                Cancel Preview
              </button>
              <button
                onClick={async () => {
                  setConfirming(true);
                  setConfirmResult(null);
                  try {
                    const token = localStorage.getItem("token");
                    const assignments = Object.entries(editedAssignments).map(([course_id, assigned_students]) => ({
                      course_id,
                      assigned_students,
                    }));
                    const res = await axios.post(
                      "http://localhost:8080/api/admin/confirm-assignments", // Corrected URL
                      { assignments },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (res.status === 200) {
                      setConfirmResult(res.data);
                      setPreviewAssignments([]);
                      setEditedAssignments({});
                    }
                  } catch (err) {
                    console.error("Confirmation error:", err); // Debug log
                    if (err.response?.status === 404) {
                      setConfirmResult({
                        message: "Assignment confirmation unavailable (404). Please verify server routes.",
                        errors: [{ reason: "Route not found. Check backend configuration." }],
                      });
                    } else {
                      setConfirmResult({
                        message: "Assignment confirmation failed",
                        errors: [{ reason: err.response?.data?.message || err.message }],
                      });
                    }
                  }
                  setConfirming(false);
                }}
                disabled={confirming}
                className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
                  confirming ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {confirming ? "Confirming..." : "Confirm Assignments"}
              </button>
            </div>

            {confirmResult && (
              <div className="mt-4 p-4 border rounded bg-gray-50">
                <div className="font-bold">{confirmResult.message}</div>
                {confirmResult.created !== undefined && <div>Assignments Created: {confirmResult.created}</div>}
                {confirmResult.skipped !== undefined && (
                  <div>Assignments Skipped (Duplicates): {confirmResult.skipped}</div>
                )}
                {confirmResult.failedCount !== undefined && <div>Failed Assignments: {confirmResult.failedCount}</div>}
                {confirmResult.errors && confirmResult.errors.length > 0 && (
                  <div className="mt-2">
                    <div className="font-semibold">Assignment Errors:</div>
                    <ul className="list-disc list-inside text-sm text-red-700">
                      {confirmResult.errors.map((err, idx) => (
                        <li key={idx}>
                          {err.course_id ? `Course ${err.course_id} (Student ${err.student_id || "N/A"}): ` : ""}
                          {err.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- Courses Table --- */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">All Courses</h2>
          <div className="mb-4">
            <button
              onClick={() => {
                const selectedCourseIds = courses.map(c => c._id); // Select all courses
                generatePreviewForCourses(selectedCourseIds);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={courses.length === 0}
            >
              Generate Preview for All Courses
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-3 border">Course Code</th>
                  <th className="py-2 px-3 border">Course Name</th>
                  <th className="py-2 px-3 border">Department</th>
                  <th className="py-2 px-3 border">Credit</th>
                  <th className="py-2 px-3 border">Semester</th>
                  <th className="py-2 px-3 border">Academic Year</th>
                  <th className="py-2 px-3 border">Students Count</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(courses) && courses.length > 0 ? (
                  courses.map((c) => {
                    const deptCounts = getDeptCountForCourse(c.course_code);
                    return (
                      <tr key={c._id} className="hover:bg-gray-50">
                        <td className="py-2 px-3 border font-mono">{c.course_code}</td>
                        <td className="py-2 px-3 border">{c.course_name}</td>
                        <td className="py-2 px-3 border">{c.department}</td>
                        <td className="py-2 px-3 border">{c.credit}</td>
                        <td className="py-2 px-3 border">{c.semester}</td>
                        <td className="py-2 px-3 border">{c.academic_year}</td>
                        <td className="py-2 px-3 border">
                          {Object.entries(deptCounts).map(([dept, count]) => (
                            <div key={dept}>
                              {dept}: {count}
                            </div>
                          ))}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-500 py-4">
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagementPage;