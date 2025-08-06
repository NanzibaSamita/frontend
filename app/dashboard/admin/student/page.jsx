"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin-sidebar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function AddStudentPage() {
  const [studentData, setStudentData] = useState({
    student_number:"",
    email: "",
    first_name: "",
    last_name: "",
    program_id: "",
    department: "",
    admission_year: "",
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

    // Decode token to extract admin's _id
    const decoded = jwtDecode(token);
    console.log(decoded._id)
    console.log(decoded)

    const userIdFromToken = decoded._id; // depending on your backend token

    // Send academic_year as number, set user_id from token
    const payload = {
      ...studentData, // <-- overwrite with _id from token
      admission_year: Number(studentData.admission_year),
    };
    console.log(payload);

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
    console.log(response.data);

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
              ["Student ID", "student_number"],
              ["Email Address", "email"],
              ["Department", "department"],
              ["Program", "program_id"],
              ["Admission Year", "admission_year"], // more descriptive label
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
