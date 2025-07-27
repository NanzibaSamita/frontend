"use client"

import { useState } from "react"

export default function FacultyProfile({ facultyData }) {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const defaultData = {
    fullName: "Aashnan Rahman",
    employeeId: "FAC002",
    email: "aashnanrahman@iut-dhaka.edu",
    department: "Computer Science and Engineering",
    designation: "Junior Lecturer",
    joinDate: "2023-07-22",
  }

  const data = facultyData || defaultData

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!")
      return
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long!")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message || "Password changed successfully!")
        setShowChangePassword(false)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        alert(data.message || "Failed to change password!")
      }
    } catch (error) {
      alert("An error occurred, please try again!")
      console.error("Error changing password:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Profile Information Card */}
      <div className="bg-white rounded-lg border border-gray-300 shadow-sm max-w-4xl">
        <div className="divide-y divide-gray-200">
          <div className="flex justify-between items-center px-8 py-6">
            <span className="text-lg text-gray-700">Full Name:</span>
            <span className="text-lg text-black">{data.fullName}</span>
          </div>

          <div className="flex justify-between items-center px-8 py-6">
            <span className="text-lg text-gray-700">Employee ID:</span>
            <span className="text-lg text-black">{data.employeeId}</span>
          </div>

          <div className="flex justify-between items-center px-8 py-6">
            <span className="text-lg text-gray-700">Email Address:</span>
            <span className="text-lg text-black">{data.email}</span>
          </div>

          <div className="flex justify-between items-center px-8 py-6">
            <span className="text-lg text-gray-700">Department:</span>
            <span className="text-lg text-black">{data.department}</span>
          </div>

          <div className="flex justify-between items-center px-8 py-6">
            <span className="text-lg text-gray-700">Designation</span>
            <span className="text-lg text-black">{data.designation}</span>
          </div>

          <div className="flex justify-between items-center px-8 py-6">
            <span className="text-lg text-gray-700">Join Date:</span>
            <span className="text-lg text-black">{data.joinDate}</span>
          </div>
        </div>
      </div>

      {/* Change Password Button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => setShowChangePassword(true)}
          className="bg-green-600 hover:bg-green-700 text-white text-lg font-medium py-4 px-16 rounded-lg transition-colors shadow-sm"
        >
          Change Password
        </button>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Change Password</h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Current Password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">New Password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>

              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showPasswords}
                  onChange={() => setShowPasswords(!showPasswords)}
                  className="accent-green-600"
                />
                <span>Show Passwords</span>
              </label>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false)
                    setCurrentPassword("")
                    setNewPassword("")
                    setConfirmPassword("")
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
