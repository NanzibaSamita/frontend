"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin-sidebar";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AddStudentPage() {
  const [studentData, setStudentData] = useState({
    user_id: "",
    email: "",
    first_name: "",
    last_name: "",
    program: "",
    department: "",
    academic_year: "",
  });
  const [credentials, setCredentials] = useState(null); // For displaying generated creds
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Handle input change
  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCredentials(null);

    try {
      const token = localStorage.getItem("token"); // Must be logged in as admin

      if (!token) {
        alert("You must be logged in as admin to perform this action.");
        setLoading(false);
        return;
      }

      // Send academic_year as number
      const payload = {
        ...studentData,
        academic_year: Number(studentData.academic_year),
      };

      const response = await axios.post(
        "http://localhost:8080/api/admin/create-student", // Correct API endpoint and port!
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      // Show the generated email & password
      setCredentials(response.data.credentials);

      // Optionally auto-redirect after a few seconds
      setTimeout(() => {
        router.push("/dashboard/admin/student/list");
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Uncomment this if you want the sidebar */}
      {/* <AdminSidebar /> */}
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-black mb-8">Add Student</h1>
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["First Name", "first_name"],
              ["Last Name", "last_name"],
              ["Student ID", "user_id"],
              ["Email Address", "email"],
              ["Department", "department"],
              ["Program", "program"],
              ["Academic Year", "academic_year"], // more descriptive label
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

          {/* Show generated credentials after success */}
          {credentials && (
            <div className="mt-6 p-4 border rounded text-green-700 bg-green-50">
              <b>Student Created!</b><br />
              Email: <code>{credentials.email}</code> <br />
              Password: <code>{credentials.password}</code> <br />
              (Sent to student’s email)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
