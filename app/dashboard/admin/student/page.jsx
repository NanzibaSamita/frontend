"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AddStudentPage() {
  const [studentData, setStudentData] = useState({
    student_number: "",
    email: "",
    first_name: "",
    last_name: "",
    program_id: "",
    department: "",
    admission_year: "",
  });
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(false);

  // Bulk upload states
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  const router = useRouter();

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCredentials(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in as admin to perform this action.");
        setLoading(false);
        return;
      }

      const payload = {
        ...studentData,
        admission_year: Number(studentData.admission_year),
      };

      const response = await axios.post(
        "http://localhost:8080/api/admin/create-student/manual-student-creation",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLoading(false);
      setCredentials(response.data.credentials);

      setTimeout(() => {
        router.push("/dashboard/admin/profile");
      }, 3500);
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 401) {
        alert("Unauthorized. Please login again as admin.");
      } else if (error.response?.status === 403) {
        alert("Forbidden. You are not authorized to create students.");
      } else if (error.response?.status === 409) {
        alert("User or Student already exists.");
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error creating student. Please try again.");
      }
    }
  };

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
        "http://localhost:8080/api/admin/create-student/bulk-upload",
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-black mb-8">Add Student</h1>
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">

          {/* ----- Single Student Form ----- */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* First Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={studentData.first_name}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={studentData.last_name}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Student ID */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Student ID
              </label>
              <input
                type="text"
                name="student_number"
                value={studentData.student_number}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={studentData.email}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Department */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                name="department"
                value={studentData.department}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="EEE">EEE</option>
                <option value="MPE">MPE</option>
                <option value="CEE">CEE</option>
                <option value="BTM">BTM</option>
              </select>
            </div>

            {/* Program */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Program
              </label>
              <select
                name="program_id"
                value={studentData.program_id}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Program</option>
                <option value="SWE_MSc">MSc in Software Engineering</option>
                <option value="CSE_MSc">MSc in Computer Science</option>
                <option value="EEE_MSc">MSc in Electrical Engineering</option>
                <option value="MPE_MSc">MSc in Mechanical Engineering</option>
                <option value="BTM_MSc">MSc in Business & Technology Management</option>
                <option value="CEE_MSc">MSc in Civil & Environmental Engineering</option>
              </select>
            </div>

            {/* Admission Year */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Admission Year
              </label>
              <input
                type="number"
                name="admission_year"
                value={studentData.admission_year}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="md:col-span-2 mt-4 text-right">
              <button
                type="submit"
                className={`bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>

          {/* ----- Credentials display (optional) ----- */}
          {credentials && (
            <div className="mt-6 p-4 border rounded text-green-700 bg-green-50">
              <b>Student Created!</b>
              <br />
              Email: <code>{credentials.email}</code> <br />
              Password: <code>{credentials.password}</code> <br />
              (Sent to student’s email)
            </div>
          )}

          {/* ----- Bulk Upload Section ----- */}
          <hr className="my-8" />
          <h2 className="text-xl font-semibold mb-2">
            Bulk Upload Students via CSV
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
                        {err.student_number
                          ? `Student ${err.student_number}: `
                          : ""}
                        {err.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
