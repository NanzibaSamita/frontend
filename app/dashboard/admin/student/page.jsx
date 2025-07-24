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

  const router = useRouter();

  // Handle input change
  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // ✅ make sure token was saved at login

      if (!token) {
        alert("You must be logged in as admin to perform this action.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/admin/create-student", // or /api/admin/create-student if that's your actual path
        studentData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Attach token to request
          },
        }
      );

      console.log(response.data);
      alert("Student created successfully!");
      router.push("/dashboard/admin/student/list");
    } catch (error) {
      console.error("Error creating student:", error);

      if (error.response?.status === 401) {
        alert("Unauthorized. Please login again as admin.");
      } else if (error.response?.status === 403) {
        alert("Forbidden. You are not authorized to create students.");
      } else if (error.response?.status === 409) {
        alert("User already exists.");
      } else {
        alert("Error creating student. Please try again.");
      }
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-black mb-8">Add Student</h1>
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Total Students: 120</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["First Name", "first_name"],
              ["Last Name", "last_name"],
              ["Student ID", "user_id"],
              ["Email Address", "email"],
              ["Department", "department"],
              ["Program", "program"],
              ["Current AY", "academic_year"],
            ].map(([label, name]) => (
              <div key={name} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <input
                  type="text"
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
                className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
