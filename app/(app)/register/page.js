"use client"

import { useState } from "react"
import Image from "next/image"
import axios from "axios"

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    program: "",
    department: "",
    password: "",
    confirmPassword: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    // Prepare data for submission
    const userData = {
      student_id: form.studentId,
      email: form.email,
      first_name: form.firstName,
      last_name: form.lastName,
      password: form.password,
      program: form.program,
      department: form.department,
    }

    try {
      // Send POST request to backend API
      const response = await axios.post("http://localhost:5000/api/auth/register", userData)

      // Display success message from backend
      alert(response.data.message)

      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        studentId: "",
        program: "",
        department: "",
        password: "",
        confirmPassword: "",
      })
    } catch (error) {
      // Handle error if any
      const errorMsg = error.response?.data?.message || "Registration failed"
      alert(errorMsg)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col items-center justify-start px-4 pt-10 md:pt-16 space-y-6">
      {/* Header logos only */}
      <div className="w-full max-w-6xl flex justify-between items-center px-4">
        <div className="w-[100px] md:w-[140px]">
          <Image
            src="/iut-left.png"
            alt="IUT Left Logo"
            width={140}
            height={140}
            className="w-full h-auto"
          />
        </div>
        <div className="w-[100px] md:w-[140px]">
          <Image
            src="/iut-right.png"
            alt="IUT Right Logo"
            width={140}
            height={140}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md space-y-6 -mt-20 md:-mt-28"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Student Registration
        </h2>
        <p className="text-center text-sm text-gray-500">
          Create your account to access the postgraduate system
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Student ID</label>
            <input
              type="text"
              name="studentId"
              placeholder="Enter student ID"
              value={form.studentId}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Program</label>
            <select
              name="program"
              value={form.program}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-green-400 focus:outline-none"
              required
            >
              <option value="">Select program</option>
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
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-green-400 focus:outline-none"
              required
            >
              <option value="">Select department</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="CEE">CEE</option>
              <option value="MCE">MCE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-green-400 focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold text-lg"
        >
          Create Account
        </button>
      </form>
    </div>
  )
}
