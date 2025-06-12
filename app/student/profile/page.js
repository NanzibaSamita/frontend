"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function StudentProfile() {
  const [profile, setProfile] = useState({
    fullName: "Sadika Tabassum",
    studentId: "220042147",
    email: "sadikatabassum@iut-dhaka.edu",
    department: "Computer Science and Engineering",
    program: "MSc in CSE",
    currentAY: "2025-2026",
  })

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      setProfile((prev) => ({ ...prev, email }))
    }
  }, [])

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Full Name */}
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-lg font-medium text-gray-900">Full Name:</span>
            <span className="text-lg text-gray-900">{profile.fullName}</span>
          </div>

          {/* Student ID */}
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-lg font-medium text-gray-900">Student ID:</span>
            <span className="text-lg text-gray-900">{profile.studentId}</span>
          </div>

          {/* Email Address */}
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-lg font-medium text-gray-900">Email Address:</span>
            <span className="text-lg text-gray-900">{profile.email}</span>
          </div>

          {/* Department */}
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-lg font-medium text-gray-900">Department:</span>
            <span className="text-lg text-gray-900">{profile.department}</span>
          </div>

          {/* Program */}
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-lg font-medium text-gray-900">Program:</span>
            <span className="text-lg text-gray-900">{profile.program}</span>
          </div>

          {/* Current AY */}
          <div className="flex justify-between items-center py-4">
            <span className="text-lg font-medium text-gray-900">Current AY:</span>
            <span className="text-lg text-gray-900">{profile.currentAY}</span>
          </div>
        </div>

        {/* Change Password Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/change-password"
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Change Password
          </Link>
        </div>
      </div>
    </div>
  )
}
