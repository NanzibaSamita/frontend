"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userEmail", formData.email)
    router.push("/student")
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header with logos */}
        <div className="flex justify-between items-center mb-12">
          <div className="w-20 h-20 bg-white rounded-lg shadow-md flex items-center justify-center border">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IUT</span>
            </div>
          </div>
          <div className="w-20 h-20 bg-white rounded-lg shadow-md flex items-center justify-center border">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CSE</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-4xl font-bold text-gray-900 mb-16">Postgraduate Academic Management System</h1>

        {/* Login Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Login</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
