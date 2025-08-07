"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin-sidebar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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
  const [credentials, setCredentials] = useState(null); // For displaying generated creds
  const [loading, setLoading] = useState(false);

  // Bulk upload states
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  const router = useRouter();

  // Handle input change for single student
  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  // Handle form submission for single student
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

      // Send admission_year as number
      const payload = {
        ...studentData,
        admission_year: Number(studentData.admission_year),
      };

      const response = await axios.post(
        "http://localhost:8080/api/admin/create-student/manual-student-creation",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      // You can optionally show credentials if backend returns them
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
        alert("User already exists.");
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error creating student. Please try again.");
      }
    }
  };

  // Handle CSV Bulk Upload
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
      {/* <AdminSidebar /> */}
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-black mb-8">Add Student</h1>
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">

          {/* ----- Single Student Form ----- */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["First Name", "first_name"],
              ["Last Name", "last_name"],
              ["Student ID", "student_number"],
              ["Email Address", "email"],
              ["Department", "department"],
              ["Program", "program_id"],
              ["Admission Year", "admission_year"],
            ].map(([label, name]) => (
              <div key={name} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <input
                  type={name === "email" ? "email" : "text"}
                  name={name}
                  value={studentData[name]}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
            ))}
            <div className="md:col-span-2 mt-4 text-right">
              <button
                type="submit"
                className={`bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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
          <h2 className="text-xl font-semibold mb-2">Bulk Upload Students via CSV</h2>
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
                        {err.student_number ? `Student ${err.student_number}: ` : ""}
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
