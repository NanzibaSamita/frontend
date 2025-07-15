"use client"

import { useState } from "react"
import axios from "axios"

export default function AdminStudentRegister() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    program: "",
    department: "",
    currentAY: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const studentData = {
      student_id: form.studentId,
      email: form.email,
      first_name: form.firstName,
      last_name: form.lastName,
      program: form.program,
      department: form.department,
      current_ay: form.currentAY,
    }

    try {
      const response = await axios.post("http://localhost:5000/api/admin/register-student", studentData)
      alert(response.data.message)

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        studentId: "",
        program: "",
        department: "",
        currentAY: "",
      })
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed"
      alert(errorMsg)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col items-center justify-start px-4 pt-10 md:pt-16 space-y-6">
      <h1 className="text-4xl font-bold text-black mb-8">Add Student</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md space-y-6 -mt-20 md:-mt-28"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Program</label>
            <select
              name="program"
              value={form.program}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-green-400"
              required
            >
              <option value="">Select Program</option>
              <option value="MSc">MSc</option>
              <option value="MEng">MEng</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-green-400"
              required
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="MCE">MCE</option>
              <option value="CEE">CEE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Current AY</label>
            <input
              type="text"
              name="currentAY"
              value={form.currentAY}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-green-400"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold text-lg"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
