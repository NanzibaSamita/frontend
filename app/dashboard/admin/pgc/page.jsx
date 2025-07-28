"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin-sidebar"; // Adjust to your setup
import { useRouter } from "next/navigation";
import axios from "axios"; // Import axios for making API requests

export default function AddFacultyPage() {
  const [facultyData, setFacultyData] = useState({
    first_name: "",
    last_name: "",
    employee_id: "",
    email: "",
    department: "",
    designation: "",
  });

  const router = useRouter();

  // Handle form field changes
  const handleChange = (e) => {
    setFacultyData({
      ...facultyData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make POST request to backend to create a faculty
      const response = await axios.post("http://localhost:5000/api/create-faculty", facultyData); // Update with correct URL
      console.log(response.data); // Log the response for debugging

      // Redirect or show success message after successful creation
      alert("Faculty created successfully!");
      // Optionally, redirect to another page, like faculty list
      router.push("/dashboard/admin/faculty/list");
    } catch (error) {
      console.error("Error creating faculty:", error);
      alert("Error creating faculty. Please try again.");
    }
  };

  return (
    <div className="flex">

      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-black mb-2">Add Faculty</h1>
        <p className="text-lg font-semibold text-gray-700 mb-6">Total Faculty: 30</p>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <div className="flex justify-end mb-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View All Faculties
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="first_name"
                value={facultyData.first_name}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={facultyData.last_name}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Employee ID</label>
              <input
                type="text"
                name="employee_id"
                value={facultyData.employee_id}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={facultyData.email}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Department</label>
              <select
                name="department"
                value={facultyData.department}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="EEE">EEE</option>
                <option value="Business">Business</option>
                {/* Add more options as needed */}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Designation</label>
              <select
                name="designation"
                value={facultyData.designation}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Designation</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Professor">Professor</option>
              </select>
            </div>

            <div className="md:col-span-2 mt-4 text-center">
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
